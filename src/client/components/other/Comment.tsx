 import useAuth from "@/client/utils/useAuth";
import { useEffect, useState } from "react";
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux";
import { RootState } from "@/client/slices/store";

import axios from '@/client/api/axios';
import { CommentType } from "@/client/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentForm from "./CommentForm";
import { useDispatch } from "react-redux";
import { setLikedComment } from "@/client/slices/user";
import { removeComment } from "@/client/slices/recipe";

interface CommentProps{
    comment:CommentType;
    index: number;
    reply: boolean;
}

export default function Comment({comment, index, reply} : CommentProps){
    
    const { auth } = useAuth();
    const dispatch = useDispatch();

    const recipeId = useSelector((state: RootState) => state.recipe._id);
    const likedComments = useSelector((state:any) => state.user.likedComments.filter((comment:any) => comment.recipeId === recipeId)[0]?.comments.includes(comment._id));

    const comments = useSelector((state: RootState) => state.recipe.comments);
    const [commentId, setCommentId] = useState(comment._id);

    const [liked, setLiked] = useState()
    const [userLiked, setUserLiked] = useState(likedComments);

    const [increment, setIncrement] = useState(liked ? -1 : 1)
   
    const date = new Date(comment.date);
    const dateString = date.toLocaleDateString("en-US", {month: 'long', day: 'numeric', year: 'numeric'});


    const [replyText, setReplyText] = useState("Reply");
    const [replying, setReplying] = useState(false);
    const [repliesVisible, setRepliesVisible] = useState(false);
    const [replies, setReplies] = useState<any>([]);


    useEffect(()=>{
        setCommentId(comment._id);
    });

    useEffect(()=>{
        // console.log(likedComments);
         setUserLiked(likedComments);
    },[likedComments, comment._id]);
    

    useEffect(()=>{
        if(!reply) setReplies(comments[index]?.replies);
    }, [comments[index]?.replies])


    useEffect(()=>{
        setIncrement(userLiked ? -1 : 1);
    }, [userLiked])


    function handleLike(){
        async function updateDB(){
            // console.log("UPDATING DB RECIPE: ", recipeId)
            try{ 
                // console.log(increment);
                const result = await axios.post(
                    `/comments/${commentId}/like`, 
                    { 
                        inc: increment, 
                        commentId, 
                        recipeId: recipeId, 
                        profileId: auth?.user?._id || "64782f70a4a50f0efa0de498", 
                        commentIndex: index
                    }
                );
                // setLikes(result.data.value.likes);
            } catch(err) {
                console.log(err);
            }
        }
        updateDB();
        console.log("Updating comment...", userLiked ? "Removing like" : "Adding like")
        dispatch(setLikedComment({recipeId, commentId, type: userLiked ? 'remove' : 'add'}))
        // setUserLiked(!userLiked);   
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
        console.log("Deleting comment... (actually just hiding it)")
        async function deleteComment(){
            try{
                const result = await axios.delete(`/comments/${commentId}`);
                console.log(result);
            } catch(err){
                console.log(err);
            }
        }
        deleteComment();
        if(reply) dispatch(removeComment({type:"reply", commentId, index}));
        else dispatch(removeComment({commentId}));
    }
    

    return(
        <div className = "comment">
            <span>
                <span className = "comment-user">{comment.username}</span> &#x2022; <span className = "comment-date">{dateString}</span>
            </span>
            {/* <h1>{comment._id}</h1> */}
            <p className = "comment-content">{comment.content}</p>
            <div className="comment-toolbar">  
                <FontAwesomeIcon 
                    onClick = {handleLike}
                    icon={faHeart}
                    className = {userLiked ? "comment-like-icon liked" : "comment-like-icon"}
                />
            
                <span className = "comment-like-counter">  { comment.likes + " likes"}</span> 
                
                { 
                    !reply &&
                    <>
                        <span> &#x2022; </span>
                        <button type = 'button' className="comment-reply-button simple-button" onClick={handleReply} >{replyText}</button>
                    </> 
                }

                { 
                    replies != undefined && replies?.length > 0 
                    ?   <button 
                            onClick = { ()=> setRepliesVisible(!repliesVisible)} 
                            className="simple-button"
                        > 
                            &#x2022; {!reply && repliesVisible ? "Hide Replies" : "Show Replies" }
                        </button>
                    :   <></>
                }


                { 
                        auth?.user?.roles?.includes(8012) && 
                        <> 
                            <span> &#x2022; </span>
                            <button className="comment-delete-button simple-button" onClick={handleDelete}>Delete</button> 
                        </>
                } 

            </div>
            
            { 
                replying && <CommentForm replyToCommentId={comment._id} index = {index} setReplying = {setReplying} setRepliesVisible={setRepliesVisible} /> 
            }

            { <div className = "replies"> 
                { 
                    repliesVisible && 

                    replies?.map((reply:any) => {
                        return !reply.hidden && <Comment reply = {true} key = {index} comment={reply} index={index}/>
                    })
                
                } 
            </div>}

        </div>

    )
} 
