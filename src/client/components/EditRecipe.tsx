
export default function EditRecipe(props: {titleID: string}){
    function handleClick(){
        fetch(`/api/recipes/${props.titleID}`, {
            method: 'GET',
        }).then((response) => {
            window.location.href = `/recipes/${props.titleID}/edit`;
        });
    }
        
    return(
        <button onClick= {handleClick}>Edit this Recipe</button>
    )
}