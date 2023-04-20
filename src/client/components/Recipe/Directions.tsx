export default function Directions(props: {directions: string}){
    return(
        <div>
            <h2 className = "header">Directions</h2>
            <p dangerouslySetInnerHTML={{__html: props.directions}}></p>
        </div>
    )
}