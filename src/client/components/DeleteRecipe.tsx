export default function DeleteRecipe(props: {titleID: string}){
    function handleClick(){
        
    }

    function handleDelete(){
        fetch(`/api/recipes/${props.titleID}`, {
            method: 'DELETE',   
        }).then(() => {
            window.location.href = '/recipes';
        });
    }
        
    return(
        <button className= "delete-button simple-button" onClick= {handleClick}> Delete this Recipe</button>
    )
}