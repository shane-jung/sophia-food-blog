export default function EditRecipe(props: {titleID: string}){
    function handleClick(){
        // fetch(`/api/recipes/${props._id}`, {
        //     method: 'PUT',
        // }).then(() => {
        //     window.location.href = '/recipes/';
        // });
       alert('Edit Recipe button clicked');
    }
        
    return(
        <button onClick= {handleClick}> Edit this Recipe</button>
    )
}