import { CommentType } from '@/client/types';
import { useLoaderData } from 'react-router';

import { Recipe } from '@/client/types';
import { Key, useEffect, useRef, useState } from 'react';
import {faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons'
import {faHeart} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '@/client/utils/useAuth';
import RatingBar from '../Recipe/RatingBar';
import axios from '@/client/api/axios';
import { set } from 'mongoose';


export default function Comments(){
    const {auth} = useAuth();
    const [recipeLoaderData] = useLoaderData() as Recipe[];
    const [comments, setComments] = useState<any>(recipeLoaderData.comments);
    const [commentsList, setCommentsList] = useState<any>();
    const [commentIdList, setCommentIdList] = useState<string[]>()
    const [commentFormIndex, setCommentFormIndex] = useState(-1);

    const userCommentLikes = auth?.user?.likedComments?.length>0 && auth.user.likedComments[0].comments;
    
    useEffect( ()=> {

        //TODO : right now the userCommentLikes is hardcoded, but it should be fetched from the database
        // Also, performance may be an issue if there are a lot of comments, so we may need to change the way the data is stored
        // (maybe sotring an array of booleans rather than int, so the array lines up with the comments on the recipe, and we don't 
        // need to use .includes() method. For example if the user likes the 3rd comment, the array would be [false, false, true, false, false]
        // and we can just check userCommentLikes[index]: boolean). I don't know how many comments it would take to slow this down,
        // so this may not be an issue.
        console.log(userCommentLikes);
    //    console.log(userCommentLikes, auth.user);
        setCommentIdList(comments.map((comment: CommentType)=> comment._id));
    }, [])


    const commentList = comments.map((comment: CommentType, index: number) => {
        return      <Comment key = {index} 
                           comment={comment} 
                           index = {index} 
                           liked = {(userCommentLikes.length > 0) && userCommentLikes.includes(index)}
                    />;
    })

    if(commentFormIndex != -1) commentList.splice(commentFormIndex, 0, <CommentForm key = {'form '+ commentFormIndex} reply={true} setComments = {setComments} />)
    commentList.reverse();
   
    return (
        <div className="comments">
            <h2>Recipe Comments ({commentList.length})</h2>
            {(commentFormIndex>-10) ? <CommentForm reply={false} setComments = {setComments} /> : <button className = "simple-button" onClick={()=>setCommentFormIndex(-1)}>Add a comment</button>}
            <div className = "comments-toolbar">
                {/* <span>Sort By</span>
                <button></button>
                <button> </button> */}
            </div>
            <div className="comment-list">
               { commentList}
            </div>
            
        </div>
    )
}
;

function CommentForm({reply, setComments}: {reply:boolean, setComments: any}){
    const { auth } = useAuth();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [content, setContent] = useState("");

    const nameRef = useRef<HTMLInputElement>(null);
   
    async function handleSubmit(event:any){
        event.preventDefault();
        console.log("submitting comment");

    setComments((prev:any) => {
        return [...prev, {username: name || auth?.user.username, content: content, date: new Date().toISOString(), likes: 0}]
    })
        

        const addCommentResult = await axios.post('/recipes/comment', {
            comment: {
                profileId : auth?.user?._id || undefined,
                email : email || auth?.user.email,
                username: name || auth?.user.username,
                content : content,
                date: new Date().toISOString(),
                likes: 0, 
            },
            reply: reply,
            recipeId: "644600514a6a31a0b4282785",
            commentId: "647aa92bdf14b8b9246cb229"
        });
        console.log(addCommentResult)
        if(addCommentResult.status != 200) return;
    }

    return(
        <form className={ "comment-form " + (reply ? "reply" : "")} onSubmit={handleSubmit} method="POST">
                {auth?.user 
                 ? <></>
                 :  <div>
                        <label htmlFor='name'>Your Name</label>
                        <input 
                            id='name' 
                            name = 'name' 
                            placeholder = "Name" 
                            ref = {nameRef} 
                            onChange = {(e)=>setName(e.target.value)} 
                            value = {name} 
                        />
                        <label htmlFor='email'>Email</label>
                        <input 
                            id='email' 
                            name = 'email' 
                            placeholder = "Email"
                            onChange = {(e)=>setEmail(e.target.value)} 
                            value = {email} 
                            required
                        />
                    </div>
                }

                <textarea 
                    name="content" 
                    className = "comment-textarea" 
                    placeholder= {reply ? 'Reply to this comment...' : 'Add a comment...' }
                    cols = {50} 
                    rows = {3} 
                    onChange = { (e) => setContent(e.target.value) }
                    value = {content}
                />

                { !reply && <>
                                <p>Did you make this recipe? Give it a rating!</p>
                                <RatingBar />
                            </>
                }
                
                <button type="submit" className="simple-button comment-submit-button">Submit</button>
            </form>
    )
}


interface CommentProps{
    comment:CommentType;
    index: number;
    liked: boolean;
}

function Comment({comment, index, liked} : CommentProps){
    const { auth } = useAuth();
    const [commentID, setCommentID] = useState(comment._id);
    const date = new Date(comment.date);
    const dateString = date.toLocaleDateString("en-US", {month: 'long', day: 'numeric', year: 'numeric'});

    const [icon, setIcon] = useState(liked ? faHeartSolid : faHeartSolid);
    const [inc, setInc] = useState(liked ? -1 : 1)
    const [userLiked, setUserLiked] = useState(liked);
    const [replyText, setReplyText] = useState("Reply");
    const [replying, setReplying] = useState(false);
    const [repliesVisible, setRepliesVisible] = useState(false);

    function handleLike(){
        const i = userLiked ? faHeartSolid : faHeartSolid;  
        setIcon(i)
        async function updateDB(){
            try{ 
                const result = await axios.post(
                    `/comments/${commentID}/like`, 
                    { inc: userLiked ? -1 : 1, commentID, recipeID: '644600514a6a31a0b4282785', profileID: auth?.user?._id || "64782f70a4a50f0efa0de498", commentIndex: index}
                );
            } catch(err) {
                console.log(err);
            }
        }
        updateDB();
        setUserLiked(!userLiked);
        
    }
    
    function handleReply(e:any){
        e.preventDefault();
        setReplying(!replying);
    }


    useEffect(()=>{
        replying ? setReplyText("Cancel") : setReplyText("Reply");

    }, [replying]);

    
    function handleDelete(e:any){
        e.preventDefault();
        console.log("Deleting comment... (need to implement)")
        // async function deleteComment(){
        //     // try{
        //     //     const result = await axios.delete(`/comments/${commentID}`);
        //     //     console.log(result);
        //     // } catch(err){
        //     //     console.log(err);
        //     // }
        // }
        // deleteComment();
    }
    const replies = comment.replies?.map((reply, index) => {
        return <Comment key = {index} comment={reply} index={index} liked={false} />
    });
    return(
        <div className = "comment">
            <span>
                <span className = "comment-user">{comment.username}</span> &#x2022; <span className = "comment-date">{dateString}</span>
            </span>
            

            <p className = "comment-content">{comment.content}</p>
            <div className="comment-toolbar">  
                <FontAwesomeIcon 
                    onClick = {handleLike}
                    icon={icon} 
                    className = {userLiked ? "comment-like-icon liked" : "comment-like-icon"}
                />
            
                <span className = "comment-like-counter">  {(comment.likes + (userLiked ? 1 : 0) ) + " likes"}</span> 
                <span> &#x2022; </span>
                <button type = 'button' className="comment-reply-button simple-button" onClick={handleReply} value={'hello'}>{replyText} </button>
                { 
                        auth?.user?.roles?.includes(8012) && 
                        <> 
                            <span> &#x2022; </span>
                            <button className="comment-delete-button simple-button" onClick={handleDelete}>Delete</button> 
                        </>
                } 
                { replies != undefined && replies?.length > 0 ? <button onClick = { ()=> setRepliesVisible(!repliesVisible)} className="simple-button"> &#x2022; {repliesVisible ? "Hide Replies" : "Show Replies" }</button> : <></>}
            </div>
            { replying && <CommentForm reply={true} setComments = {()=>{console.log("add comment")}} /> }
            <div className = "replies">
                
                { repliesVisible && replies }

            </div>
        </div>

    )
} 
