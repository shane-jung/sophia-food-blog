import { CommentType } from '@/client/types';
import { useLoaderData } from 'react-router';

import { Recipe } from '@/client/types';
import {useEffect, useState } from 'react';

import useAuth from '@/client/utils/useAuth';

import CommentForm from './CommentForm';
import Comment from './Comment';


export default function Comments(){
    const {auth} = useAuth();
    const [recipeLoaderData] = useLoaderData() as Recipe[];
    const [comments, setComments] = useState<any>(recipeLoaderData.comments);
    const [commentsList, setCommentsList] = useState<any>();
    const [commentIdList, setCommentIdList] = useState<string[]>()
    const [commentFormIndex, setCommentFormIndex] = useState(-1);

    const userCommentLikes = auth?.user?.likedComments?.length>0 && auth.user.likedComments[0].comments;
    
    useEffect( ()=> {

        //TODO : right now the userCommentLikes is hardcoded, but it should be fetched from the database
        // Also, performance may be an issue if there are a lot of comments, so we may need to change the way the data is stored
        // (maybe sotring an array of booleans rather than int, so the array lines up with the comments on the recipe, and we don't 
        // need to use .includes() method. For example if the user likes the 3rd comment, the array would be [false, false, true, false, false]
        // and we can just check userCommentLikes[index]: boolean). I don't know how many comments it would take to slow this down,
        // so this may not be an issue.
        // console.log(userCommentLikes);
    //    console.log(userCommentLikes, auth.user);
        setCommentIdList(comments.map((comment: CommentType)=> comment._id));
    }, [])


    const commentList = comments.map((comment: CommentType, index: number) => {
        return      <Comment 
                            reply = {false}
                            key = {index} 
                            comment={comment} 
                            index = {index} 
                            liked = {(userCommentLikes.length > 0) && userCommentLikes.includes(index)}
                    />;
    })

    if(commentFormIndex != -1) commentList.splice(commentFormIndex, 0, <CommentForm key = {'form '+ commentFormIndex} setComments = {setComments} />)
    commentList.reverse();
   
    return (
        <div className="comments">
            <h2>Recipe Comments ({commentList.length})</h2>
            {(commentFormIndex>-10) ? <CommentForm setComments = {setComments} /> : <button className = "simple-button" onClick={()=>setCommentFormIndex(-1)}>Add a comment</button>}
            <div className = "comments-toolbar">
                {/* <span>Sort By</span>
                <button></button>
                <button> </button> */}
            </div>
            <div className="comment-list">
               { commentList}
            </div>
            
        </div>
    )
}
;



