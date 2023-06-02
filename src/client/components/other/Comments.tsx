import { CommentType } from '@/client/types';
import { useLoaderData } from 'react-router';

import { Recipe } from '@/client/types';
import { useEffect, useRef, useState } from 'react';
import {faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons'
import {faHeart} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '@/client/utils/useAuth';
import RatingBar from '../Recipe/RatingBar';
import axios from '@/client/api/axios';

var activelyReplying = false;


export default function Comments(){
    const {auth} = useAuth();
    const [recipeLoaderData, commentLoaderData] = useLoaderData() as [Recipe, CommentType[]];
    const [comments, setComments] = useState(commentLoaderData);
    const [commentsList, setCommentsList] = useState<any>();
    const [commentIdList, setCommentIdList] = useState<string[]>()

    
    useEffect( ()=> {

        //TODO : right now the userCommentLikes is hardcoded, but it should be fetched from the database
        // Also, performance may be an issue if there are a lot of comments, so we may need to change the way the data is stored
        // (maybe sotring an array of booleans rather than int, so the array lines up with the comments on the recipe, and we don't 
        // need to use .includes() method. For example if the user likes the 3rd comment, the array would be [false, false, true, false, false]
        // and we can just check userCommentLikes[index]: boolean). I don't know how many comments it would take to slow this down,
        // so this may not be an issue.

        const userCommentLikes = auth?.user?.likedComments && auth.user.likedComments[0].comments;
    //    console.log(userCommentLikes, auth.user);
        const c = (comments!=undefined) && comments.map((comment,index) => {
            return <Comment key={index} comment={comment} index = {index} liked = {userCommentLikes?.includes(index)} />;
        });
        setCommentsList(c);
        setCommentIdList(comments.map(comment => comment._id));
    }, [])
    

    return (
        <div className="comments">
            <h2>Comments</h2>
            {!activelyReplying && <CommentForm reply ={false} />}
            <div className = "comments-toolbar">
                {/* <span>Sort By</span>
                <button></button>
                <button> </button> */}
            </div>
            <div className="comment-list">
               {commentsList}   
            </div>
            
        </div>
    )
}
;

function CommentForm({reply}: {reply:boolean}){
    const { auth } = useAuth();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [content, setContent] = useState("");

    const nameRef = useRef<HTMLInputElement>(null);
   
    async function handleSubmit(event:any){
        event.preventDefault();
        console.log("submitting comment");
        const addCommentResult = await axios.post('/comments', {
            profileId : auth?.user?._id || undefined,
            email : email || auth?.user.email,
            username: name || auth?.user.username,
            content : content,
            date: new Date().toISOString(),
            likes: 0, 
        });
        console.log(addCommentResult)
        if(addCommentResult.status != 200) return;

        const addCommentToRecipeResult = await axios.post(`/recipes/test-recipe/comment`, {
            commentId: addCommentResult.data.insertedId,
        })
    }

    return(
        <form className="comment-form" onSubmit={handleSubmit} method="POST">
                {auth?.user 
                 ?  <p>Signed in as <b>{auth.user.username} </b></p>
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

                { !reply && <>
                                <p>Did you make this recipe? Give it a rating!</p>
                                <RatingBar />
                            </>
                }

 
                <textarea 
                    name="content" 
                    className = "comment-textarea" 
                    placeholder='Add a comment...' 
                    cols = {50} 
                    rows = {5} 
                    onChange = { (e) => setContent(e.target.value) }
                    value = {content}
                />
                
                <button type="submit" className="simple-button comment-submit-button">Submit</button>
            </form>
    )
}


interface CommentProps{
    comment:CommentType;
    index: number;
    liked: boolean;
}

function Comment({comment, index, liked}:CommentProps){
    const { auth } = useAuth();
    const [commentID, setCommentID] = useState(comment._id);
    const date = new Date(comment.date);
    const dateString = date.toLocaleDateString("en-US", {month: 'long', day: 'numeric', year: 'numeric'});

    const [icon, setIcon] = useState(liked ? faHeartSolid : faHeart);
    const [inc, setInc] = useState(liked ? -1 : 1)
    const [userLiked, setUserLiked] = useState(liked);
    const [replyText, setReplyText] = useState("Reply");

    function handleLike(){
        const i = userLiked ? faHeart : faHeartSolid;  
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
        setReplyText(activelyReplying ? "Reply" : "Cancel")

        // setActivelyReplying(!activelyReplying);
        activelyReplying = !activelyReplying;
    }

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
    return(
        <div className = "comment">
            <p className = "comment-user">{comment.username}</p>
            <p className = "comment-date">{dateString}</p>

            <p className = "comment-content">{comment.content}</p>
            <div className="comment-toolbar">  
                <div className="comment-like-container">
                    <button className= "comment-like-button simple-button" onClick = {handleLike}>Like <FontAwesomeIcon icon={icon} /></button>
              
                    <span className = "comment-like-counter"> {comment.likes + (userLiked ? 1 : 0)}</span>   
                </div>
                <div>
                    <button className="comment-submit-button simple-button" onClick={handleReply}>{replyText} </button>
                    { 
                            auth?.user?.roles.includes(8012) && 
                            <> 
                                <span> or </span>
                                <button className="comment-delete-button simple-button" onClick={handleDelete}>Delete</button> 
                            </>
                    }
                </div>
            </div>
            {
                activelyReplying && <CommentForm reply = {true} />
            }
        </div>

    )
} 
