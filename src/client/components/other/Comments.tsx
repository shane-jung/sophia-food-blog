import {useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/client/slices/store';


export default function Comments(){
    const comments = useSelector((state: RootState) => state.recipe.comments);
    return (
        <section id="comments" className="comments">
            <h2>Recipe Comments ({comments?.length})</h2>
            <CommentForm index = {-1} />
            <div className = "comments-toolbar" />
            <div className="comment-list">
               {    
                   
                    comments?.map((comment: any, index: number) => {
                        return <Comment 
                                        reply = {false}
                                        key = {index} 
                                        comment={comment} 
                                        index = {index} 
                                />;
                    })
                }
            </div>
            
        </section>
    )
}
;



