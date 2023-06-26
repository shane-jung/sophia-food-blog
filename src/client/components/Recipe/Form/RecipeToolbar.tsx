import useAxiosPrivate from "../../../utils/useAxiosPrivate";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faEdit,
  faPlus,
  faSave,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import queryClient from "@/client/utils/queryClient";
import Button from "react-bootstrap/Button";  
import Tooltip from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";


export default function EditRecipeToolbar() {
  return (
    <div className="recipe-toolbar">
      <EditButton />
      <SaveButton />
      <DeleteButton />
    </div>
  );
}

export function HomepageToolbar() {
  return (
    <div className="recipe-toolbar">
      <AddRecipe />
      <Settings />
    </div>
  );
}

export  function CreateRecipeToolbar() {
  return (
    <div className="recipe-toolbar">
      <SaveButton />
    </div>
  );
}

function AddRecipe(){
  const navigate = useNavigate();
  function handleClick (){
    navigate('/recipes/create');
  }
  return (
    <IconButton
      handleClick={handleClick}
      name= {"Create New Recipe"}
      faIcon = {faPlus}
    />
  )
}


function EditButton() {
  const [buttonText, setButtonText] = useState('Edit Recipe');
  const [buttonIcon, setButtonIcon] = useState(faEdit);
  const navigate = useNavigate();

  const toggleViewMode = (e: any) => {
    e.preventDefault();
    navigate("edit");
  };

  return (
    <IconButton handleClick={toggleViewMode} faIcon={buttonIcon} name={buttonText} />
  );
}

function SaveButton() {
  const viewMode = useSelector((state: any) => state.user.viewMode);
  const [buttonText, setButtonText] = useState("");

  useEffect(() => {
    if (viewMode == "CREATING") setButtonText("Save");
    else setButtonText("Save");
  }, [viewMode]);

  

  return (
    <IconButton className= {viewMode == "VIEWING" ? "inactive" : "" } handleClick={null} faIcon={faSave} name={buttonText} />

  );
}

function DeleteButton() {
  const recipe = useSelector((state: any) => state.recipe);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const mutation = useMutation({
    mutationFn: async () => await axiosPrivate.delete(`/recipes/${recipe._id}`),
    onSuccess: (response) => {
      console.log(response);


      navigate("/recipes", { replace: true });
      queryClient.invalidateQueries(["recipes"]);
    },
  });
  const tagsMutation = useMutation({
      mutationFn  : async () => await axiosPrivate.post(`/tags/removeRecipeFromTags`, {tags: recipe.tags, recipeId: recipe._id} ),
      onSuccess: (response:any) => {  
        // console.log(response);
        mutation.mutate();

        queryClient.invalidateQueries(["tags"]);
      }
  });



  async function handleDelete() {
    tagsMutation.mutate(); 
    // if (result.status === 200) navigate("/recipes", { replace: true });
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (
      window.confirm("Are you sure you want to permanently delete this recipe?")
    ) {
      handleDelete();
    }
  }

  return (
    <IconButton
      handleClick={handleClick}
      name={"Delete Recipe"}
      faIcon={faTrashAlt}
    />
  );
}

function Settings() {
  const navigate = useNavigate();
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    navigate("/admin");
  }
  return (
    <IconButton handleClick={handleClick} faIcon={faCog} name={"Settings"} />
  );
}

function IconButton({ handleClick, faIcon, name, className }: any) {
  return (
    <OverlayTrigger placement={"left"} overlay={<Tooltip>{name}</Tooltip>}>
      <Button variant={"secondary"} className={"mt-2 icon-button round p-4 text-light " + className } onClick={handleClick} type ="submit">
        <FontAwesomeIcon icon={faIcon} />
      </Button>
    </OverlayTrigger>
  );
}
