import { EditableContext } from "@/client/contexts/EditableContext"
import { useState, useContext } from "react"
import  ReactQuill from "react-quill"



interface RichTextEditorProps {
    // reference: any;
    className: string;
    placeholder : string;
    
}
export default function RichTextEditor(props:RichTextEditorProps){

    const [state, setState] = useState({ content: '' })
    const isEditable = useContext(EditableContext);

    const modules = {
        toolbar: [
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
      }

    
    
    const formats = [
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    

    function onChange(value:string){
        setState({ content: value })
    }
    return <ReactQuill readOnly = {!isEditable} defaultValue={props.placeholder} className= {props.className} theme="snow" modules = {modules} formats = {formats} onChange = {onChange}/>

}