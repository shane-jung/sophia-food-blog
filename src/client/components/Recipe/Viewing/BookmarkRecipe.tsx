import { getUser } from "@/client/queries";
import useAuth from "@/client/utils/useAuth";
import axios from "@/client/api/axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router";

import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Col from "react-bootstrap/Col";

import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RecipeThumbnail from "../../Browse/RecipeThumbnail";

export default function BookmarkRecipe({ recipeId }: { recipeId: string }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const user = useQuery(["user"], () => getUser(auth?.user?._id))?.data;

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
          queryClient.setQueryData(["user"], (oldData: any) => {
            if (saved) {
             return(
                { ...user,
                savedRecipes: user.savedRecipes.filter(
                  (id: string) => id !== recipeId
                ),
              });
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
    // console.log(saved, auth, user);
    if (!auth?.isAuthenticated) return navigate(`/users/login`);
    setSaved(!saved);
    if (!saved) setShowSaved(true);
    userMutation.mutate();
  };

  return (
    <>
      
      <Button className="bookmark-button d-flex align-items-center gap-2">
        <span>Save Recipe</span>
        <FontAwesomeIcon
          icon={faBookmark}
          onClick={saveRecipe}
          className={saved ? "active" : ""}
        />
      </Button>
      
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
