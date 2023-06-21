import { RootState } from "@/client/slices/store";
import useAuth from "@/client/utils/useAuth";
import axios from "../../../api/axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InteractiveRatingBar } from "../RatingBar";

import { useMutation } from "react-query";
import queryClient from "@/client/utils/queryClient";

import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";

export default function CommentForm({
  index,
  replyToCommentId,
  setReplying,
  setRepliesVisible,
}: {
  index: number;
  replyToCommentId?: string;
  setReplying?: any;
  setRepliesVisible?: any;
}) {
  const { auth } = useAuth();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const recipeId = useSelector((state: RootState) => state.recipe._id);

  const postCommentMutation = useMutation({
    mutationFn: postComment,
    onSuccess: (newComment) => {
      queryClient.setQueryData(["comments", recipeId], (oldComments: any) => {
        const repliesEdited = oldComments.map((comment: any) =>
          comment._id == newComment._id ? newComment : comment
        );
        return repliesEdited.map((p: any) => p._id).includes(newComment._id)
          ? repliesEdited
          : oldComments
          ? [...oldComments, newComment]
          : [newComment];
      });
    },
  });

  const nameRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: any) {
    event.preventDefault();
    setContent("");
    if (replyToCommentId) {
      setReplying(false);
      setRepliesVisible(true);
    }
    // window.scrollBy({
    //     top: 100,
    //     behavior: 'smooth'
    // });

    const data1 = {
      comment: {
        profileId: auth?.user?._id || "",
        recipeId,
        email: email || auth?.user.email,
        username: name || auth?.user.username,
        content: content,
        date: new Date().toISOString(),
        likes: 0,
        hidden: false,
      },
      reply: replyToCommentId ? true : false,
      commentId: replyToCommentId,
    };

    postCommentMutation.mutate(data1);
  }

  return (
    <Form
      className={"comment-form " + (replyToCommentId ? "reply" : "")}
      onSubmit={handleSubmit}
      method="POST"
    >
      {auth?.user ? (
        <></>
      ) : (
        <>
          <FloatingLabel label="Your name">
            <Form.Control
              id="name"
              name="name"
              placeholder="Name"
              ref={nameRef}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </FloatingLabel>
          
          <FloatingLabel label="email">
            <Form.Control
              id="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </FloatingLabel>
        </>
      )}

      <Form.Control as="textarea" rows={3}
        name="content"
        placeholder={
          replyToCommentId ? "Reply to this comment..." : "Add a comment..."
        }
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />

      {!replyToCommentId && (
        <>
          <Form.Text>Did you make this recipe? Give it a rating!</Form.Text>
          <InteractiveRatingBar />
        </>
      )}

      <Button variant="outline-success" type="submit">
        Submit
      </Button>
    </Form>
  );
}

async function postComment(comment: any) {
  const { data } = await axios.post("/comments", comment);
  console.log(data);
  return data;
}
