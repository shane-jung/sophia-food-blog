
import { CommentType } from "@/client/types";
interface CommentProps{
    comment:CommentType;
}
export default function Comment({comment}:CommentProps){
    return(
        <div className = "comment">
            <p className = "comment-content">{comment.content}</p>
            <p className = "comment-date">{comment.date}</p>
            <CommentToolbar></CommentToolbar>
        </div>

    )
} 

function CommentToolbar(){
    return(
        <>
            <button className= "comment-like-button simple-button" onClick={handleLike}>Like</button>
            <button className="comment-submit-button simple-button" onClick={handleReply}>Reply</button>
        </>
    )
}

function handleLike(e:any){
    e.preventDefault();
    console.log("comment recieved a like");
}

function handleReply(e:any){
    e.preventDefault();
    console.log("Reply button clicked");
}