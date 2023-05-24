import { useContext } from "react"
import { EditableContext } from "../../contexts/EditableContext"
import useAuth  from "@/client/utils/useAuth"

interface SimpleTextRecipeComponentProps{
    className: string;
    value: string;
    name: string;
}
export default function SimpleTextRecipeComponent(props:SimpleTextRecipeComponentProps){
    const isEditable = useContext(EditableContext);
    const { auth } = useAuth();
    const placeholder = "Recipe " + props.name;
    return (
        <>  
            {
                auth?.accessToken  ?
                    <input name= {props.name} className ={props.className + " input-field"} defaultValue = {props.value} placeholder={placeholder} readOnly = {!isEditable} required></input>
                :
                    <div className = {props.className}>{props.value}</div>
            }
        </>
    )
}