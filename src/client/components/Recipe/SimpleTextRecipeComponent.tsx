import { useContext } from "react"
import { EditableContext } from "../../contexts/EditableContext"
import useAuth  from "@/client/utils/useAuth"
import useViewMode from "@/client/utils/useViewMode";
import { _viewMode } from "@/client/enums";

interface SimpleTextRecipeComponentProps{
    className: string;
    value: string;
    name: string;
}
export default function SimpleTextRecipeComponent(props:SimpleTextRecipeComponentProps){
    const { viewMode } = useViewMode();
    const { auth } = useAuth();
    const placeholder = "Recipe " + props.name;
    return (
        <>  
            {
                viewMode != _viewMode.VIEWING  ?
                    <input name= {props.name} className ={props.className + " input-field"} defaultValue = {props.value} placeholder={placeholder} readOnly = {viewMode == _viewMode.VIEWING} required></input>
                :
                    <div className = {props.className}>{props.value}</div>
            }
        </>
    )
}