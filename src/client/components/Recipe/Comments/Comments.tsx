import CommentForm from "./CommentForm";

import { lazy, Suspense, useEffect, useState } from "react";
import Loading from "../../other/Loading";
import { useSelector } from "react-redux";

const CommentsList = lazy(() => import("./CommentsList"));

export default function Comments() {
  const [commentsLength, setCommentsLength] = useState(0);
  return (
    <section id="comments" className="comments">
      <h2>Recipe Comments ({commentsLength})</h2>
      <CommentForm index={-1} />
      <div className="comments-toolbar" />

      <Suspense fallback={<Loading />}>
        <CommentsList setCommentsLength = {(n:number)=>setCommentsLength(n)} />
      </Suspense>
    </section>
  );
}
