

async function recipeLoader ({request, params} :any){
    console.log(params.titleID);
    return fetch(
        `/api/recipes/${params.titleID}`)
        .then(response => response.json())
}

export {recipeLoader};