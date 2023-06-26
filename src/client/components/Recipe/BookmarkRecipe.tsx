import { getUser } from "@/client/queries";
import useAuth from "@/client/utils/useAuth";
import axios from "@/client/api/axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Offcanvas from "react-bootstrap/Offcanvas";
import Col from "react-bootstrap/Col";

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
      });
    },
    {
      onSuccess: (response) => {
        console.log(response);
        // queryClient.invalidateQueries(["user", "saveRecipe", auth.user._id]);
        if (!saved)
          queryClient.setQueryData(["user"], (oldData: any) => {
            console.log(saved);
            if (saved) {
              return {
                ...user,
                savedRecipes: user.savedRecipes.filter(
                  (id: string) => id !== recipeId
                ),
              };
            } else
              return {
                ...user,
                savedRecipes: [recipeId, ...user.savedRecipes],
              };
          });
      },
    }
  );

  const saveRecipe = () => {
    console.log(saved, auth, user);
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
      <Offcanvas show={showSaved} onHide={() => setShowSaved(false)} xs={5}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fs-2">Your Saved Recipes</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {user?.savedRecipes
            ?.map((recipeId: string, index: number) => {
              return (
                <Col
                  key={index}
                  xs={11}
                  sm={11}
                  lg={11}
                  xl={11}
                  className="mx-auto"
                >
                  <RecipeThumbnail recipeId={recipeId} />;
                </Col>
              );
            })
            .slice(0, 4)}
          <Button
            className="d-block mx-auto text-center w-auto"
            href={`/profile/${auth.user?._id}`}
          >
            View all
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
