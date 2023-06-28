import axios from "@/client/api/axios";
import { setRecipe } from "@/client/slices/recipe";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { useQuery } from "react-query";

export default function CommentsList({setCommentsLength } : {setCommentsLength: any}){
  const recipeId = useSelector((state: any) => state.recipe.activeRecipeId);


  const fetchedComments = useQuery({
    queryKey:  ["comments", recipeId],
    queryFn: retrieveComments,
  }).data;

  const [comments, setComments] = useState<any>([]);
  const [commentsRender, setCommentsRender] = useState<any>([]);

  useEffect(() => {
    setComments(fetchedComments);
    setCommentsLength(fetchedComments?.length);
  }, [fetchedComments]);

  useEffect(() => {
    setCommentsRender(
      comments?.map((comment: any, index: number) => {
        return (
          <Comment reply={false} key={index} comment={comment} index={index}  />
        );
      })
    );
  }, [comments]);

  return <div className="comment-list">{commentsRender}</div>;
}

async function retrieveComments({ queryKey }: any) {
  if(queryKey[1] === '') return [];
  const recipeId = queryKey[1];
  const response = await axios.get(`/recipes/${recipeId}/comments`);
  const data = response.data;
  return data;
}
