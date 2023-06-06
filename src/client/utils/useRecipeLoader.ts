import { useSelector } from "react-redux";
import axios, { axiosPrivate } from "../api/axios";


export default function useRecipeLoader(){    
    const retrieveComments = async (recipeId: string) =>{
        // console.log("RECIPE ID", recipeId);
        const response = await axios.get(`/recipes/${recipeId}/comments`);
        // console.log(response.data);
        return await response.data;
    }
    
    const retrieveLikedComments = async (recipeId: string, userId: string) =>{
        const response = await axiosPrivate.get(`/users/${userId}`);
        const likedCommentsFull = await response.data.user?.likedComments;
        // console.log(recipeId);
        const likedComments = likedCommentsFull ? likedCommentsFull.filter((comment:any) => comment.recipeId === recipeId)[0]?.comments || [] : [];
        // console.log("IN RETRIEVE", likedComments);
        return likedComments;
    }
    

    return async (recipeId: string, userId: string) => {
        const comments = recipeId ? await retrieveComments(recipeId) : [];
        const likedComments = await retrieveLikedComments(recipeId, userId);
        // console.log(recipeId)

        return {comments, likedComments}
    }
}