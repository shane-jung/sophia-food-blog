export default function DeleteRecipe(props: {titleID: string}){
    function handleClick(){
        fetch(`/api/recipes/${props.titleID}`, {
            method: 'DELETE',   
        }).then(() => {
            window.location.href = '/recipes';
        });
        alert('Delete Recipe button clicked')
    }
        
    return(
        <button onClick= {handleClick}> Delete this Recipe</button>
    )
}