
import { useContext } from "react";
import useAuth from "@/client/utils/useAuth"



interface TitleIdProps{
    value:string;
}

export default function TitleId(props:TitleIdProps){
    const { auth } = useAuth();
    return(
      auth.user?.roles?.includes(8012) && <input className="recipe-title-id" type="text" name="titleId" defaultValue = {props.value} placeholder="TITLE Id (REQUIRED)" readOnly = {false}/>
    )
}