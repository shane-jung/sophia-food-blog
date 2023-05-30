import Comment from '@/client/components/other/Comment';
import { CommentType } from '@/client/types';
import { useLoaderData } from 'react-router';

import { Recipe } from '@/client/types';
import { useState } from 'react';
    
export default function Comments(){
    const [recipeLoaderData, commentLoaderData] = useLoaderData() as [Recipe, CommentType[]];
    const [comments, setComments] = useState(commentLoaderData);
    function handleSubmit(event:any){
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        data.append('date', new Date().toISOString());
        let content = data.get("content") as string;
        let date = data.get("date") as string;
        fetch(`/api/comments`,
        {
            method:"POST",
            body:data,
        }
        ).then(async (response)=>{
            const commentId = (await response.json()).insertedId;
            let newComment : CommentType= {content: content, date: date, _id: commentId, likes: 0, username: "Anonymous"};
            setComments([...comments, newComment])
            const data = new FormData();
            data.append("commentId", commentId);
            return fetch(`/api/recipes/${recipeLoaderData.titleID}/comment`, 
            {
                method:'POST',
                body: data,
            });
        });
    }
    const commentsList = (comments==undefined) ? <></> :  comments.map((comment,index) => {
        return <Comment key={index} comment={comment} />;
    });
    
    return (
        <div className="comments">
            <h2 className = "comments-title">Comments</h2>
            <form className="comment-form" onSubmit={handleSubmit} method="POST">
                <input type='text' name="content" className = "comment-textarea" placeholder='Add a comment...'/>
                <button type="submit" className="simple-button comment-submit-button">Submit</button>
            </form>
            <div className="comment-list">
               {commentsList}   
            </div>
            
           
        </div>
    )
}