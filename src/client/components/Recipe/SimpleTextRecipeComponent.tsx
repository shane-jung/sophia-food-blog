import { _viewMode } from "@/client/enums";
import { useSelector } from "react-redux";

interface SimpleTextRecipeComponentProps{
    className: string;
    value: string;
    name: string;
}
export default function SimpleTextRecipeComponent(props:SimpleTextRecipeComponentProps){
    const viewMode = useSelector((state: any) => state.user.viewMode);
    const placeholder = "Recipe " + props.name;
    return (
        <>  
            {
                viewMode != "VIEWING"  ?
                    <div className="input-field-container" style={{'position':'relative'}}>
                        <label className= "input-field-label">{props.name}</label>
                        <input name= {props.name} className ={props.className + " input-field"} defaultValue = {props.value} readOnly = {viewMode == _viewMode.VIEWING} required></input>
                    </div>
                :
                    <div className = {props.className}>{props.value}</div>
            }
        </>
    )
}