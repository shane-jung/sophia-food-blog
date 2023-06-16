import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setRecipe } from "../slices/recipe";
import { setViewMode } from "../slices/user";
import queryClient from "../utils/queryClient";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import RecipeContainer from "./RecipeContainer";

export default function CreateRecipeForm() {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedTags = useSelector((state: any) => state.recipe.selectedTags);

  const recipeMutation = useMutation({
    mutationFn: async (payload: any) =>
      await axiosPrivate.post("/recipes/create", payload, {
        withCredentials: true,
      }),
    onSuccess: (response) => {
      dispatch(setViewMode("viewing-recipe"));
      dispatch(
        setRecipe({ type: "set-recipe", recipe: { tags: selectedTags } })
      );
      tagsMutation.mutate({recipeId: response.data.recipe._id, tagIds: selectedTags})
      queryClient.invalidateQueries({
        queryKey: ["recipes"],
        exact: true,
      });
      navigate(`/recipes/${response.data.recipe.titleId}`, { replace: true });
    },
  });

  const tagsMutation = useMutation({
    mutationFn: async (payload: any) =>
      await axiosPrivate.post("/tags/addRecipeToTags", payload, {
        withCredentials: true,
      }),
    onSuccess: (response) => {
      console.log(response);

    }

  });

  const handleRecipeCreate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log("here");
    const data = new FormData(event.currentTarget);
    // if(!verifyInputs(data)) return;
    data.set("dateEdited", new Date().toISOString());
    data.set("tags", selectedTags);
    data.set("dateCreated", new Date().toISOString());
    // data.set("author", sampleAuthor.toString());
    recipeMutation.mutate(data);
  };

  return (
    <form
      className="recipe-form"
      method="POST"
      encType="multipart/form-data"
      onSubmit={handleRecipeCreate}
    >
      <RecipeContainer />
    </form>
  );
}

function verifyInputs(data: FormData) {
  for (const [field, value] of data) {
    if (!value) {
      console.log(`Error: ${field} field cannot be empty.`);
      return false;
    }
  }
  return true;
}
