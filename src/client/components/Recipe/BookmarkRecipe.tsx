import { getUser } from "@/client/queries";
import useAuth from "@/client/utils/useAuth";
import axios from "@/client/api/axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Offcanvas from "react-bootstrap/Offcanvas";

import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RecipeThumbnail from "./RecipeThumbnail";

export default function BookmarkRecipe({ recipeId }: { recipeId: string }) {
  const { auth } = useAuth();

  const user = useQuery(["user"], () => getUser(auth?.user?._id))?.data;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(
    user?.savedRecipes?.includes(recipeId)
  );
  const [showSaved, setShowSaved] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const userMutation = useMutation(
    ["user", "saveRecipe", auth.user?._id],
    () => {
      
      return axios.post(`/users/${auth.user?._id}/saveRecipe`, {
        recipeId,
        push: !saved,
      })},
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(["user", auth.user._id]);
      },
    }
  );

  const saveRecipe = () => {
    if (!auth?.isAuthenticated) return setShowModal(true);
    setSaved(!saved);
    if (!saved) setShowSaved(true);
    userMutation.mutate();
  };

  return (
    <>
      <Button className="bookmark-button">
        <FontAwesomeIcon
          icon={faBookmark}
          onClick={saveRecipe}
          className={saved ? "active" : ""}
        />
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            Sign in to save this recipe.
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>All we'll need </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Offcanvas show={showSaved} onHide={() => setShowSaved(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your saved Recipes</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {user?.savedRecipes
            ?.map((recipeId: string, index: number) => {
              return <RecipeThumbnail key={index} recipeId={recipeId} />;
            })
            .slice(0, 4)}
          <Button href={`/profile/${auth.user?._id}`}>View all</Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
