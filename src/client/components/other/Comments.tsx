import { CommentType } from '@/client/types';
import { useLoaderData } from 'react-router';

import { Recipe } from '@/client/types';
import {useEffect, useState } from 'react';

import useAuth from '@/client/utils/useAuth';

import CommentForm from './CommentForm';
import Comment from './Comment';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/client/slices/store';

import {setComments} from '../../slices/recipe'




export default function Comments(){
    const {auth} = useAuth();
    const comments = useSelector((state: RootState) => state.recipe.comments);
    const [commentsJSX, setCommentsJSX] = useState<any>([]);
    const userCommentLikes = auth?.user?.likedComments?.length>0 && auth.user.likedComments[0].comments;

    useEffect(()=>{
        console.log(comments);
        const c = comments.map((data: any, index: number) => {
            return      !data.comment.hidden &&
                        <Comment 
                                reply = {false}
                                key = {index} 
                                comment={data.comment} 
                                index = {index} 
                                liked = {(userCommentLikes.length > 0) && userCommentLikes.includes(index)}
                        />;
        });
        setCommentsJSX(c);
    }, [comments])
    
    return (
        <div className="comments">
            <h2>Recipe Comments ({comments?.length})</h2>
            <CommentForm index = {-1} />
            <div className = "comments-toolbar" />
            <div className="comment-list">
               { commentsJSX}
            </div>
            
        </div>
    )
}
;



