import { useContext, useState} from "react"
import { EditableContext } from "../../contexts/EditableContext"
import { AuthenticationContext } from "../../contexts/AuthenticationContext"

import ReactQuill from "react-quill"

interface RichTextRecipeComponentProps{
    className: string;
    value: string;
    name: string;
}
export default function     RichTextRecipeComponent(props:RichTextRecipeComponentProps){
    const isEditable = useContext(EditableContext);
    const isAuthenticated = useContext(AuthenticationContext);
    const placeholder = "Recipe " + props.name;
    const [state, setState] = useState({ content: props.value })

    const modules = {
        toolbar: [
          ['bold', 'italic', 'underline','strike'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
      }

    
    
    const formats = [
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    
    function onChange(value:string){
        setState({ content: value })
    }

    return (
        <>  
            {
                isAuthenticated  ?
                    <>
                        <ReactQuill readOnly = {!isEditable} defaultValue = {props.value} placeholder={placeholder} className= {props.className + " input-field"} theme="snow" modules = {modules} formats = {formats} onChange = {onChange}/>
                        <input aria-hidden= "true" readOnly = {true} className = {props.className + " hidden-input"} name = {props.name} value={state.content}  placeholder = {placeholder}></input>
                    </>
                :
                
                    <div className = {props.className} dangerouslySetInnerHTML= {{__html : props.value}}></div>
            }
        </>
    )
}