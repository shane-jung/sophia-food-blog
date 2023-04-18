

async function recipeLoader ({request, params} :any){
    return fetch(
        `/api/recipes/${params.titleID}`)
        .then(response => response.json())
}

export {recipeLoader};