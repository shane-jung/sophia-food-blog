import {useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/client/slices/store';


export default function Comments(){
    const comments = useSelector((state: RootState) => state.recipe.comments);

    return (
        <div className="comments">
            <h2>Recipe Comments ({comments?.length})</h2>
            <CommentForm index = {-1} />
            <div className = "comments-toolbar" />
            <div className="comment-list">
               {
                    comments?.map((data: any, index: number) => {
                        return!data.comment.hidden &&
                                <Comment 
                                        reply = {false}
                                        key = {index} 
                                        comment={data.comment} 
                                        index = {index} 
                                />;
                    })
                }
            </div>
            
        </div>
    )
}
;



