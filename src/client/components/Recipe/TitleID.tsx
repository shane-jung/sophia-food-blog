
import { useContext } from "react";
import useAuth from "@/client/utils/useAuth"



interface TitleIDProps{
    value:string;
}

export default function TitleID(props:TitleIDProps){
    const { auth } = useAuth();
    return(
      auth?.accessToken && <input className="recipe-title-id" type="text" name="titleID" defaultValue = {props.value} placeholder="TITLE ID (REQUIRED)" readOnly = {false}/>
    )
}