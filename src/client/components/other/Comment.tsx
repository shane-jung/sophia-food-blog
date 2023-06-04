 import useAuth from "@/client/utils/useAuth";
import { useEffect, useState } from "react";
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux";
import { RootState } from "@/client/slices/store";

import axios from '@/client/api/axios';
import { CommentType } from "@/client/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentForm from "./CommentForm";

interface CommentProps{
    comment:CommentType;
    index: number;
    liked: boolean;
    reply: boolean;
}

export default function Comment({comment, index, liked, reply} : CommentProps){
    const recipeId = useSelector((state: RootState) => state.recipe.activeRecipeId);

    const { auth } = useAuth();
    const  comments  = useSelector((state: RootState) => state.recipe.comments);
    const [commentId, setCommentId] = useState(comment._id);
    const date = new Date(comment.date);
    const dateString = date.toLocaleDateString("en-US", {month: 'long', day: 'numeric', year: 'numeric'});

    const [userLiked, setUserLiked] = useState(liked);
    const [replyText, setReplyText] = useState("Reply");
    const [replying, setReplying] = useState(false);
    const [repliesVisible, setRepliesVisible] = useState(false);
    const [replies, setReplies] = useState<any>([]);
    const [repliesJSX, setRepliesJSX] = useState<any>([]);

    useEffect(()=>{
        if(!reply) setReplies(comments[index].replies);
        console.log(comments);
    }, [comments[index]])

    useEffect(()=>{
        console.log(replies);
        setRepliesJSX( ()=> {
            return replies?.map((reply:any, index:number) => {
                return <Comment reply = {true} key = {index} comment={reply} index={index} liked={false} />
            });
        });
    }, [replies]);


    function handleLike(){
        async function updateDB(){
            try{ 
                const result = await axios.post(
                    `/comments/${commentId}/like`, 
                    { 
                        inc: userLiked ? -1 : 1, 
                        commentId, 
                        recipeId: recipeId, 
                        profileId: auth?.user?._id || "64782f70a4a50f0efa0de498", 
                        commentIndex: index
                    }
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
        async function deleteComment(){
            try{
                const result = await axios.delete(`/comments/${commentId}`);
                console.log(result);
            } catch(err){
                console.log(err);
            }
        }
        deleteComment();
    }
    

    return(
        <div className = "comment">
            <span>
                <span className = "comment-user">{comment.username}</span> &#x2022; <span className = "comment-date">{dateString}</span>
            </span>

            <p className = "comment-content">{comment.content}</p>
            <div className="comment-toolbar">  
                <FontAwesomeIcon 
                    onClick = {handleLike}
                    icon={faHeart}
                    className = {userLiked ? "comment-like-icon liked" : "comment-like-icon"}
                />
            
                <span className = "comment-like-counter">  {(comment.likes + (userLiked ? 1 : 0) ) + " likes"}</span> 
                
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
                { repliesVisible && repliesJSX } 
            </div>}

        </div>

    )
} 
