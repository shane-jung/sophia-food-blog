import { useState } from "react";



export default function RatingBar(){

    var [activeRating, setActiveRating] = useState(-1);
    var [tempActiveRating, setTempActiveRating] = useState(-1);

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
                  
                />
                <label 
                    htmlFor={"star-"+ index}
                    className={"rating-star" + (highlighted? " checked" : "")}
                    onClick={()=>setActiveRating(index)}
                    onMouseEnter = {()=>setTempActiveRating(index)}
                    onMouseLeave = {()=>setTempActiveRating(-1)}
                    >
                    
                </label>
            </>
        )
    }
    const stars :any = [];

    for (let i = 0; i < 5; i++){
        let highlighted = (i <= activeRating) || (i <= tempActiveRating);
        stars.push(RatingStar({index:i, highlighted: highlighted}));
    }
    
    return(
        <div className="rating-bar">
            {stars}
        </div>

    )
}