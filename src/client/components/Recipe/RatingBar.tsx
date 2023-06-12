
import { _viewMode } from "@/client/enums";
import { useEffect, useState } from "react";

import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import axios from "@/client/api/axios";
import { Rating } from "@/client/types";

interface RatingStarInterface{
    index:number;
    highlighted:Boolean;
    isEditable:Boolean;
}

export default function RatingBar({initialRating, postRating} : {initialRating?: number, postRating?: (rating:Rating) => void;}){
    const [activeRating, setActiveRating] = useState(-1);
    const [tempActiveRating, setTempActiveRating] = useState(-1);
    const [isEditable, setIsEditable] = useState( initialRating==undefined);
    const recipeId= useSelector((state:any) => state.recipe._id);
    const userId = useSelector((state:any) => state.user._id);

    useEffect(() => {
        if(initialRating) setActiveRating(initialRating);
    }, [initialRating])

    function RatingStar({index, highlighted, isEditable}:RatingStarInterface){

        
        function handleClick(){
            setActiveRating(index);
            if(postRating) postRating({
                rating: index, 
                date: new Date().toString(), 
                recipeId: recipeId, 
                userId: userId
            });
        }
        
        return (
                
                    isEditable ?
                    <>
                        <input
                                type="radio"
                                name="rating"
                                value={index}
                                id={"star"+index}
                                className = "rating-star-input offscreen"
                                defaultChecked = { index == activeRating}
                            />
                        <label htmlFor={"star"+index} className="rating-star-label">
                            <FontAwesomeIcon
                                key={ index }
                                icon = { faStarSolid }
                                onMouseEnter = {()=>setTempActiveRating(index)}
                                onMouseLeave = {()=>setTempActiveRating(-1)}
                                onClick={handleClick}
                                className= { "rating-star " + (highlighted ? "highlighted" : "")}
                            />
                        </label>
                    </>
                    
                    : 
                    <FontAwesomeIcon
                        // id={"star-"+index}
                        key={index} 
                        icon = { faStarSolid}
                        className= { "static rating-star " + (highlighted ? "highlighted" : "")}
                    />
                
        )
    }
    const stars = Array.from({length: 5}, (_, i) => i+1).map((i) => {
        let highlighted = (i <= activeRating) || (i <= tempActiveRating);
        // console.log(activeRating);
        return <RatingStar key={i} index= {i} highlighted = {highlighted} isEditable= {isEditable}/>
    })
    return(
        
       <div className="rating-bar"> {stars} </div> 
    )
}

export function StaticRatingBar(){
    const [numberOfRatings, setNumberOfRatings] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    const ratings = useSelector((state:any) => state.recipe.ratings);

    useEffect(() => {
        console.log(ratings);   
        setNumberOfRatings(ratings.length);
        setAverageRating(ratings.reduce((a:number, b:Rating) => a + b.rating , 0) / ratings.length);
    }, [ratings])

    return(
        <>
            <RatingBar initialRating = {Math.round(averageRating)} /> 
            <div className="rating-bar-description">({averageRating.toFixed(2)} from {numberOfRatings} ratings)</div>
        </>
    )
}

export function InteractiveRatingBar(){

    async function postRating({rating, date, recipeId, userId} : Rating){
        try{
            const response = await axios.post('/recipes/rating', {
                rating: rating,
                date: date,
                recipeId: recipeId,
                userId: userId
                
            })
            console.log(response);
        } catch (error: any){

        }
    }
    return(
        <RatingBar postRating = {postRating}/> 
    )
}