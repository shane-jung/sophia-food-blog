import CommentForm from "./CommentForm";

import { lazy, Suspense, useState } from "react";
import Loading from "../../other/Loading";
import Container from "react-bootstrap/Container";

const CommentsList = lazy(() => import("./CommentsList"));

export default function Comments({recipeId}: {recipeId:string}) {
  const [commentsLength, setCommentsLength] = useState(0);
  return (
    <section id="comments" className="border-4 border-top pt-3">
      <h5>Recipe Comments ({commentsLength})</h5>
      <CommentForm  recipeId={recipeId}/>
      <Container className="comments-toolbar" />

      <Suspense fallback={<Loading />}>
        <CommentsList setCommentsLength = {(n:number)=>setCommentsLength(n)} recipeId={recipeId} />
      </Suspense>
    </section>
  );
}
