interface EditButtonProps{
    startEditing: (node:React.ReactNode) => void;
    child: React.ReactNode;
    contentEditable: boolean;
}

export default function EditButton(props:EditButtonProps){
    return(
        <button className="edit-button" contentEditable= {false} onClick = {()=> props.startEditing(props.child)}>Edit</button>
    )
}