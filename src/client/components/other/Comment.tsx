
import { CommentType } from "@/client/types";
interface CommentProps{
    comment:CommentType;
}
export default function Comment({comment}:CommentProps){
    const date = new Date(comment.date);
    const dateString = date.toLocaleDateString("en-US", {month: 'long', day: 'numeric', year: 'numeric'});
    return(
        <div className = "comment">
            <p className = "comment-user">Sophia</p>
            <p className = "comment-content">{comment.content}</p>
            <p className = "comment-date">{dateString}</p>
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