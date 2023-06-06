

import useAxiosPrivate from '../utils/useAxiosPrivate';
import { useNavigate } from 'react-router';
import useViewMode from '../utils/useViewMode';
import { _viewMode } from '../enums';

export default function DeleteRecipe(props: {titleId: string}){
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    async function handleDelete(){
        const result = await axiosPrivate.delete(`/recipes/${props.titleId}`);
        if(result.status === 200) navigate('/recipes', {replace: true});
    }

    function handleClick(){
        if(window.confirm('Are you sure you want to permanently delete this recipe?')){
            handleDelete();
        }
    }

    const {viewMode} = useViewMode();
        
    return(
        <button className= "delete-button simple-button" onClick= {handleClick}> Delete this Recipe</button>
    )
}