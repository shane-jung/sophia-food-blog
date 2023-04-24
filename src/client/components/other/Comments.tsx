import Comment from '@/client/components/other/Comment';
import { CommentType } from '@/client/types';
import { useLoaderData } from 'react-router';

import { Recipe } from '@/client/types';

export default function Comments(){
    const [recipeLoaderData, comments] = useLoaderData() as [Recipe, CommentType[]];
    function handleSubmit(event:any){

        event.preventDefault();
        let data = new FormData(event.currentTarget);
        data.append('date', new Date().toString());

        fetch(`/api/comments`,
        {
            method:"POST",
            body:data,
        }
        ).then(async (response)=>{
            const commentId = (await response.json()).insertedId;
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
            <h2>Comments</h2>
            <div className="comment-list">
               {commentsList}   
            </div>
            <form className="comment-form" onSubmit={handleSubmit} method="POST">
                <input type='text' name="content" className = "comment-textarea" placeholder='Add a comment...'/>
                <input type="submit" value="Submit"></input>
            </form>
           
        </div>
    )
}