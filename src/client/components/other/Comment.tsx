
import { CommentType } from "@/client/types";
interface CommentProps{
    comment:CommentType;
}
export default function Comment({comment}:CommentProps){
    const date = new Date(comment.date);
    const dateString = date.toLocaleDateString("en-US", {month: 'long', day: 'numeric', year: 'numeric'});
    return(
        <div className = "comment">
            <p className = "comment-user">{comment.username} </p>
            <p className = "comment-date">{dateString}</p>

            <p className = "comment-content">{comment.content}</p>
            <div className="comment-toolbar">  
                <div className="comment-like-container">
                    <button className= "comment-like-button simple-button" onClick={handleLike}>Like</button>
                    <span className = "comment-like-counter">{comment.likes}</span>   
                </div>

                <button className="comment-submit-button simple-button" onClick={handleReply}>Reply</button>
            </div>
        </div>

    )
} 

function handleLike(e:any){
    e.preventDefault();
    console.log("comment recieved a like");
}

function handleReply(e:any){
    e.preventDefault();
    
}