import { useRef } from "react";

interface DescriptionProps {
    description:string;
}

export default function Description(props: DescriptionProps){
    return(
        <p  className = "recipe-description" dangerouslySetInnerHTML ={{__html: props.description}}></p>
    )
}