import { useSelector } from "react-redux";
import axios, { axiosPrivate } from "../api/axios";


export default function useRecipeLoader(){    
    const retrieveComments = async (commentIds: string[]) =>{
        if(!commentIds || commentIds.length === 0) return [];
        const comments = await Promise.all(commentIds.map(async (commentId: string) => {
            try{ 
                const comment = await axios.get(`/comments/${commentId}`);
                return comment.data;
            } catch (error){

            }
            
        }));
        return comments.filter((comment:any) => comment.hidden !== true);
    }

    const retrieveTags = async (tagIds: string[]) =>{
        if(!tagIds || tagIds.length === 0) return [];
        const tags = await Promise.all(tagIds.map(async (tagId: string) => {
            try{ 
                const tag = await axios.get(`/recipes/tags/${tagId}`);
                return tag.data;
            } catch (error){

            }
        }));
        return tags;
    }

    

    return async (commentIds:string[] , tagIds: string[]) => {
        const comments = await retrieveComments(commentIds);
        const tags = await retrieveTags(tagIds);
        return {comments, tags};
    }
}