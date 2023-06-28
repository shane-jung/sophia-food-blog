import useAuth from "@/client/utils/useAuth";
import { useEffect, useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/client/slices/store";

import axios from "@/client/api/axios";
import { CommentType } from "@/client/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentForm from "./CommentForm";
import { useDispatch } from "react-redux";
import { setLikedComment } from "@/client/slices/user";
import queryClient from "@/client/utils/queryClient";
import { useMutation } from "react-query";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

interface CommentProps {
  comment: CommentType;
  index: number;
  reply: boolean;
  parentId?: string;
}

export default function Comment({
  comment,
  index,
  reply,
  parentId,
}: CommentProps) {
  const { auth } = useAuth();
  const dispatch = useDispatch();
  const recipeId = useSelector(
    (state: RootState) => state.recipe.activeRecipeId
  );

  const likedComments = useSelector((state: any) =>
    state.user.likedComments
      .filter((comment: any) => comment.recipeId === recipeId)[0]
      ?.comments.includes(comment._id)
  );

  const [commentId, setCommentId] = useState(comment._id);

  const [liked, setLiked] = useState();
  const [userLiked, setUserLiked] = useState(likedComments);

  const [increment, setIncrement] = useState(liked ? -1 : 1);

  const date = new Date(comment.date);
  const dateString = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [replyText, setReplyText] = useState("Reply");
  const [replying, setReplying] = useState(false);
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [replies, setReplies] = useState<any>([]);
  const [repliesFiltered, setRepliesFiltered] = useState<any>([]);

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.setQueryData(["comments", recipeId], (oldComments: any) =>
        oldComments
          ? oldComments.filter((comment: any) => comment._id !== commentId)
          : []
      );
    },
  });

  useEffect(() => {
    setCommentId(comment._id);
  });

  useEffect(() => {
    setUserLiked(likedComments);
  }, [likedComments, comment._id]);

  useEffect(() => {
    if (!reply) setReplies(comment.replies);
  }, [comment.replies]);

  useEffect(() => {
    setRepliesFiltered(replies?.filter((reply: any) => !reply.hidden));
  }, [replies]);
  useEffect(() => {
    setIncrement(userLiked ? -1 : 1);
  }, [userLiked]);

  function handleLike() {
    async function updateDB() {
      try {
        const result = await axios.post(`/comments/${commentId}/like`, {
          inc: increment,
          commentId,
          recipeId: recipeId,
          profileId: auth?.user?._id || "64782f70a4a50f0efa0de498",
          commentIndex: index,
        });
      } catch (err) {
        console.log(err);
      }
    }
    updateDB();
    dispatch(
      setLikedComment({
        recipeId,
        commentId,
        type: userLiked ? "remove" : "add",
      })
    );
    // setUserLiked(!userLiked);
  }

  function handleReply(e: any) {
    e.preventDefault();
    setReplying(!replying);
  }

  useEffect(() => {
    replying ? setReplyText("Cancel") : setReplyText("Reply");
  }, [replying]);

  function handleDelete(e: any) {
    e.preventDefault();
    console.log("here");
    console.log(comment);
    if (!commentId) return;
    deleteCommentMutation.mutate({ commentId, parentId });
  }

  return (
    <Container className= {"comment border border-2 mb-2 p-2 " + (comment.profileId == auth?.user?._id ? "me" : "") }>
      <Container className="d-flex gap-1">
        <span className="text-secondary username">{comment.username}</span>{" "}
        <span> &#x2022; </span>
        <span>{dateString}</span>
      </Container>
      <Container>
        <p>{comment.content}</p>
      </Container>
      <Container className="d-flex gap-2 align-items-center">
        <FontAwesomeIcon
          onClick={handleLike}
          icon={faHeart}
          className={
            userLiked ? "comment-like-icon liked" : "comment-like-icon"
          }
        />

        <span className="comment-like-counter">{comment.likes + " likes"}</span>

        {!reply && (
          <>
            <span> &#x2022; </span>
            <Button variant="primary px-2" onClick={handleReply}>
              {replyText}
            </Button>
          </>
        )}

        {replies != undefined && repliesFiltered?.length > 0 && (
          <>
            <span>&#x2022;</span>
            <Button
              variant="primary px-2"
              onClick={() => setRepliesVisible(!repliesVisible)}
            >
              {!reply && repliesVisible ? "Hide Replies" : "Show Replies"}
            </Button>
          </>
        )}

        {(comment.profileId == auth?.user?._id ||
          auth?.user?.roles?.includes(8012)) && (
          <>
            <span> &#x2022; </span>
            <Button variant="danger px-2" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </Container>

      {replying && (
        <CommentForm
          replyToCommentId={comment._id}
          setReplying={setReplying}
          setRepliesVisible={setRepliesVisible}
        />
      )}

      {
        <Container className="replies">
          {repliesVisible &&
            repliesFiltered?.map((reply: any, replyIndex: number) => {
              return (
                <Comment
                  reply={true}
                  key={index + "-reply" + replyIndex}
                  comment={reply}
                  index={index}
                  parentId={commentId}
                />
              );
            })}
        </Container>
      }
    </Container>
  );
}

function deleteComment({
  commentId,
  parentId,
}: {
  commentId: string;
  parentId?: string;
}) {
  return axios.post(`/comments/${commentId}/delete`, { parentId });
}
