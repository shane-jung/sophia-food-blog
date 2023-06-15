import { _viewMode } from "@/client/enums";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface SimpleTextRecipeComponentProps{
    className: string;
    initialValue: string;
    name: string;
}
export default function SimpleTextRecipeComponent({className, initialValue, name}:SimpleTextRecipeComponentProps){
    const viewMode = useSelector((state: any) => state.user.viewMode);
    const [value, setValue] = useState(initialValue);
    const recipe = useSelector((state: any) => state.recipe);

    useEffect(() => {  
        setValue(initialValue);        
    }, [recipe])

    return (
        <>  
            {
                viewMode !== "VIEWING"  ?
                    <div className="input-field-container">
                        {/* <label className= "input-field-label">{name}</label> */}
                        <input name= {name} placeholder= {"Recipe " + name} className ={className + " input-field"} defaultValue = {value} readOnly = {viewMode == "VIEWING"} required />
                    </div>
                :
                    <div className = {className}>{initialValue}</div>
            }
        </>
    )
}