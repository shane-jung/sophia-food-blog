import axios from "@/client/api/axios";
import { setRecipe } from "@/client/slices/recipe";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { useQuery } from "react-query";

export default function CommentsList({setCommentsLength, recipeId } : {setCommentsLength: any, recipeId: string}){
  const { data, status } = useQuery({
    queryKey:  ["comments", recipeId],
    queryFn: retrieveComments,
  });

  const [comments, setComments] = useState<any>([]);
  const [commentsRender, setCommentsRender] = useState<any>([]);

  useEffect(() => {
    // console.log(data);
    setComments(data);
    setCommentsLength(data.length);
  }, [data]);

  useEffect(() => {
    setCommentsRender(
      comments?.map((comment: any, index: number) => {
        return (
          <Comment reply={false} key={index} comment={comment} index={index} recipeId={recipeId} />
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
