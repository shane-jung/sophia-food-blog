import { useState, useRef } from "react"
import  ReactQuill from "react-quill"



interface RichTextEditorProps {
    reference: any;
    
}
export default function RichTextEditor(props:RichTextEditorProps){

    const [state, setState] = useState({ text: '' })
    

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
        setState({ text: value })
    }
    return <ReactQuill theme="snow" modules = {modules} formats = {formats} ref = {props.reference} onChange = {onChange}/>

}