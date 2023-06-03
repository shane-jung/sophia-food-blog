import { RootState } from "@/client/slices/store";
import useAuth from "@/client/utils/useAuth";
import axios from "../../api/axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import RatingBar from "../Recipe/RatingBar";


export default function CommentForm({replyToCommentId, setComments, setReplying, setRepliesVisible}: {replyToCommentId?: string, setComments: any, setReplying?: any, setRepliesVisible?: any}){
    const { auth } = useAuth();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [content, setContent] = useState("");

    const recipeId = useSelector((state: RootState) => state.recipe.activeRecipeId);


    const nameRef = useRef<HTMLInputElement>(null);
   
    async function handleSubmit(event:any){
        event.preventDefault();
        console.log("submitting comment");

        setComments((prev:any) => {
            return [...prev, {username: name || auth?.user.username, content: content, date: new Date().toISOString(), likes: 0}]
        });
        
        setContent(""); 
        if(replyToCommentId) { 
            setReplying(false);
            setRepliesVisible(true)
        }
            
        const addCommentResult = await axios.post('/recipes/comment', {
            comment: {
                profileId : auth?.user?._id || undefined,
                email : email || auth?.user.email,
                username: name || auth?.user.username,
                content : content,
                date: new Date().toISOString(),
                likes: 0, 
            },
            reply: (replyToCommentId ? true : false),
            commentId: replyToCommentId,
            recipeId,
        });
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