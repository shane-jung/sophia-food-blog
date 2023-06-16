import RecipeContainer from "./RecipeContainer";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import queryClient from "../utils/queryClient";
import { useDispatch } from "react-redux";
import { setViewMode } from "../slices/user";
import { setRecipe } from "../slices/recipe";

export default function EditRecipeForm() {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const recipeId = useSelector((state: any) => state.recipe._id);
  const selectedTags = useSelector((state: any) => state.recipe.selectedTags);
  
  const recipeMutation = useMutation({
    mutationFn: async (recipe: any) =>
      await axiosPrivate.put(`/recipes/${recipeId}`, recipe, {
        withCredentials: true,
      }),
    onSuccess: (response) => {
      dispatch(setViewMode("viewing-recipe"));
      queryClient.setQueryData(
        ["recipe", response.data.value.titleId],
        (oldData: any) => {
          return response.data.value;
        }
      );
      tagsMutation.mutate({recipeId: response.data.value._id, tagIds: selectedTags})
      dispatch(
        setRecipe({ type: "set-recipe", recipe: { tags: selectedTags } })
      );
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

  const handleRecipeUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    // console.log('here');
    const data = new FormData(event.currentTarget);
    data.set("dateEdited", new Date().toISOString());
    console.log(selectedTags);
    data.set("tags", JSON.stringify(selectedTags));
    recipeMutation.mutate(data);
  };

  return (
    <>
      <form
        className="recipe-form"
        method="POST"
        encType="multipart/form-data"
        onSubmit={handleRecipeUpdate}
      >
        <RecipeContainer />
      </form>
    </>
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
