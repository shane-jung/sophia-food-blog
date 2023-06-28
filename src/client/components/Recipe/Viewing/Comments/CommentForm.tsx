import { RootState } from "@/client/slices/store";
import useAuth from "@/client/utils/useAuth";
import axios from "../../../../api/axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InteractiveRatingBar } from "../RatingBar";

import { useMutation, useQueryClient } from "react-query";

import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row"

export default function CommentForm({
  replyToCommentId,
  setReplying,
  setRepliesVisible,
}: {
  replyToCommentId?: string;
  setReplying?: any;
  setRepliesVisible?: any;
}) {
  const { auth } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const recipeId = useSelector(
    (state: RootState) => state.recipe.activeRecipeId
  );

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
    console.log(event.currentTarget.rating?.value);
    // return;
    setContent("");
    if (replyToCommentId) {
      setReplying(false);
      setRepliesVisible(true);
    }
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
      className={
        "position-relative comment-form " + (replyToCommentId ? "reply" : "")
      }
      onSubmit={handleSubmit}
      method="POST"
    >
      {!auth?.user && (
        <Form.Group as ={Row}> 
          <Col xs={5} className="pe-0">
            <FloatingLabel label="Your Name">
              <Form.Control
                name="name"
                className="mb-2"
                placeholder = "name"
                ref={nameRef}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </FloatingLabel>
          </Col>
          <Col className= "ps-1"> <FloatingLabel label="Email">
            <Form.Control
              id="email"
              name="email"
              className="mb-2"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </FloatingLabel>
          </Col>
        </Form.Group>
      )}

      <Form.Control
        as="textarea"
        rows={3}
        name="content"
        className="mb-2"
        placeholder={
          replyToCommentId ? "Reply to this comment..." : "Add a comment..."
        }
        onChange={(e) => setContent(e.target.value)}
        value={content}
        required
      />

      {!replyToCommentId && (
        <Container>
          <Form.Text>Did you make this recipe? Give it a rating!</Form.Text>
          <InteractiveRatingBar />
        </Container>
      )}

      <Button variant="secondary" type="submit" className="mt-2">
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
