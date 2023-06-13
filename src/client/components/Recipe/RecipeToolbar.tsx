import useAxiosPrivate from '../../utils/useAxiosPrivate';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faEdit, faSave, faTrash, faTrashAlt, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setViewMode } from '@/client/slices/user';

export default function RecipeToolbar(){
    return (
        <div className="recipe-toolbar">
            <EditButton/>
            <SaveButton/>
            <DeleteButton/>
        </div>
    )
}

function EditButton() {
    const viewMode = useSelector((state:any) => state.user.viewMode);
    const dispatch = useDispatch();
    const tooltipText = viewMode == "VIEWING" ? "Edit Recipe" : "Cancel";

    const toggleViewMode = (e:any) =>{
        e.preventDefault();
        const action = viewMode == "VIEWING" ? "EDIT_RECIPE" : "VIEW_RECIPE";
        dispatch(setViewMode(action));
    }

    return(
        <button 
            className= "icon-button round edit-button simple-button"
            type= "button" 
            onClick = {toggleViewMode}> 
                <FontAwesomeIcon 
                    className= {"edit-icon "} 
                    icon= {viewMode == "EDITING" ? faXmark : faEdit} 
                /> 
                <span className = "icon-button-tooltip">
                    {tooltipText}
                </span>
        </button>
        
    )
}



function SaveButton(){

    const viewMode = useSelector((state:any) => state.user.viewMode);
    const [buttonText, setButtonText] = useState("");
    
    useEffect(()=>{ 
        if (viewMode == "CREATING") setButtonText("Create Recipe");
        else setButtonText("Save");
    }, [viewMode]);

    return(
        <button className = { "icon-button round save-button" + (viewMode == "VIEWING" ? " active" : "") } type="submit" >
            <FontAwesomeIcon 
                icon= {faSave}
                className= "save-icon"
            />
            <span className = "icon-button-tooltip">
                    Save Changes
            </span>
        </button>
    )
}



function DeleteButton(){
    const recipe = useSelector((state:any) => state.recipe);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    async function handleDelete(){
        const result = await axiosPrivate.delete(`/recipes/${recipe._id}`); //TODO: Add recipe ID
        if(result.status === 200) navigate('/recipes', {replace: true});
    }

    function handleClick(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        if(window.confirm('Are you sure you want to permanently delete this recipe?')){
            handleDelete();
        }
    }
        
    return(
        <button className= "icon-button round delete-button" onClick= {handleClick}> 
            <FontAwesomeIcon 
                icon= {faTrashAlt}
                className = "delete-icon"
            />
            <span className = "icon-button-tooltip">
                    Delete this recipe
            </span>
        </button>
    )
}