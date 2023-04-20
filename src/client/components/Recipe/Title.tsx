interface TitleProps{
    title:string;
}

export default function Title( props : TitleProps){
    return(
        <h1 className = "recipe-title header" >{props.title}</h1>
    )
}