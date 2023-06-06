
import { _viewMode } from "@/client/enums";
import useViewMode from "@/client/utils/useViewMode";
import { useState } from "react";

import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default function RatingBar(){

    const [activeRating, setActiveRating] = useState(-1);
    const [tempActiveRating, setTempActiveRating] = useState(-1);

    interface RatingStarInterface{
        index:number;
        highlighted:Boolean;
    }
    function RatingStar({index, highlighted}:RatingStarInterface){
        return (
            <FontAwesomeIcon
                id={"star-"+index}
                key={index}
                icon = {highlighted ? faStarSolid : faStar}
                onMouseEnter = {()=>setTempActiveRating(index)}
                onMouseLeave = {()=>setTempActiveRating(-1)}
                onClick={()=>setActiveRating(index)}
                className="rating-star"
            />
        )
    }
    const stars = [0, 1, 2, 3, 4].map((star:any, i:number) => {
        let highlighted = (i <= activeRating) || (i <= tempActiveRating);
        return <RatingStar key={i} index= {i} highlighted = {highlighted }/>

    })
    return(
        
       <div className="rating-bar"> {stars} </div> 

        

    )
}