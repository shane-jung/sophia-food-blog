export default function Date(props: { dates: any}){
    const dateCreatedString  = props.dates.dateCreated.toString();
    const dateEditedString = props.dates.dateEdited  ? props.dates.dateEdited.toString() : "";
    return(
        <div>
            <p>Date Created: {dateCreatedString}</p>
            <p>Last Edit: {dateEditedString} </p>   
        </div>
       
    )
}