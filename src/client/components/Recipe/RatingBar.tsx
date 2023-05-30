
import { _viewMode } from "@/client/enums";
import useViewMode from "@/client/utils/useViewMode";
import { useState } from "react";



export default function RatingBar(){

    const [activeRating, setActiveRating] = useState(-1);
    const [tempActiveRating, setTempActiveRating] = useState(-1);

    const { viewMode } = useViewMode();

    interface RatingStarInterface{
        index:number;
        highlighted:Boolean;
    }
    function RatingStar({index, highlighted}:RatingStarInterface){
        return (
            <>
                <input 
                    type='radio'
                    name='rating'
                    className={"rating-star-input"}
                    id={"star-"+index}
                    data-key={index}
                    key={index}
                  
                />
                <label 
                    htmlFor={"star-"+ index}
                    className={"rating-star" + (highlighted? " checked" : "")}
                    onClick={()=>setActiveRating(index)}
                    onMouseEnter = {()=>setTempActiveRating(index)}
                    onMouseLeave = {()=>setTempActiveRating(-1)}
                    key = {'label-'+index}
                    >
                    
                </label>
            </>
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