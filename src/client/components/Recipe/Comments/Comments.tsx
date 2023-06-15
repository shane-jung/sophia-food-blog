import CommentForm from "./CommentForm";

import { lazy, Suspense, useEffect, useState } from "react";
import Loading from "../../other/Loading";
import { useSelector } from "react-redux";

const CommentsList = lazy(() => import("./CommentsList"));

export default function Comments() {
  return (
    <section id="comments" className="comments">
      <h2>Recipe Comments ({2})</h2>
      <CommentForm index={-1} />
      <div className="comments-toolbar" />

      <Suspense fallback={<Loading />}>
        <CommentsList />
      </Suspense>
    </section>
  );
}
