import { RootState } from "@/client/slices/store";
import useAuth from "@/client/utils/useAuth";
import axios from "../../api/axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RatingBar from "../Recipe/RatingBar";

import {addComment, addReply} from "@/client/slices/recipe";


export default function CommentForm({index, replyToCommentId, setReplying, setRepliesVisible}: {index: number, replyToCommentId?: string, setReplying?: any, setRepliesVisible?: any}){
    const { auth } = useAuth();
    const comments = useSelector((state: RootState) => state.recipe.comments);
    const dispatch = useDispatch();;

    
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [content, setContent] = useState("");

    const recipeId = useSelector((state: RootState) => state.recipe.activeRecipeId);


    const nameRef = useRef<HTMLInputElement>(null);
   
    async function handleSubmit(event:any){
        event.preventDefault();
        console.log("submitting comment");

        
        setContent(""); 

        
        if(replyToCommentId) { 
            setReplying(false);
            setRepliesVisible(true)
        }
        const addCommentResult = await axios.post('/comments', {
            comment: {
                profileId : auth?.user?._id || "",
                recipeId,
                email : email || auth?.user.email,
                username: name || auth?.user.username,
                content : content,
                date: new Date().toISOString(),
                likes: 0, 
            },
            reply: (replyToCommentId ? true : false),
            commentId: replyToCommentId,
        });
        const data = {
                        comment:{
                            _id: addCommentResult.data.insertedId, 
                            username: name || auth?.user.username, 
                            content: content, 
                            date: new Date().toISOString(), 
                            likes: 0
                        }
                    }

        if(index==-1) { 
            console.log("addingComment")
            dispatch(addComment({...data, replies: []}));
        } else {
            console.log("addingReply");
            dispatch(addReply({...data, index:index}));     
        }
        if(addCommentResult.status != 200) return;
    }

    return(
        <form className={ "comment-form " + (replyToCommentId ? "reply" : "")} onSubmit={handleSubmit} method="POST">
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
                    placeholder= {replyToCommentId ? 'Reply to this comment...' : 'Add a comment...' }
                    cols = {50} 
                    rows = {3} 
                    onChange = { (e) => setContent(e.target.value) }
                    value = {content}
                />

                { !replyToCommentId && <>
                                <p>Did you make this recipe? Give it a rating!</p>
                                <RatingBar />
                            </>
                }
                
                <button type="submit" className="simple-button comment-submit-button">Submit</button>
            </form>
    )
}