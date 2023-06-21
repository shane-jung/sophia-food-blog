import CommentForm from "./CommentForm";

import { lazy, Suspense, useEffect, useState } from "react";
import Loading from "../../other/Loading";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";

const CommentsList = lazy(() => import("./CommentsList"));

export default function Comments() {
  const [commentsLength, setCommentsLength] = useState(0);
  return (
    <section id="comments" className="border-4 border-top pt-3">
      <h5>Recipe Comments ({commentsLength})</h5>
      <CommentForm index={-1} />
      <Container className="comments-toolbar" />

      <Suspense fallback={<Loading />}>
        <CommentsList setCommentsLength = {(n:number)=>setCommentsLength(n)} />
      </Suspense>
    </section>
  );
}
