


export default function RatingBar(){


    function RatingStar(){
        return (
            <input 
                type='radio'
                name='rating'
            />
        )
    }
    const stars = [];
    for (let i = 0; i < 5; i++){
        stars.push(RatingStar());
    }
    
    return(
        <div className="rating-bar">
            {stars}
        </div>

    )
}