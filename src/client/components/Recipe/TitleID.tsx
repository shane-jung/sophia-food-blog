
import { useContext } from "react";
import { AuthenticationContext } from "@/client/contexts/AuthenticationContext";

interface TitleIDProps{
    value:string;
}

export default function TitleID(props:TitleIDProps){
    const isAuthenticated = useContext(AuthenticationContext);
    return(
      isAuthenticated ? 
        <input className="recipe-title-id" type="text" name="titleID" defaultValue = {props.value} placeholder="TITLE ID (REQUIRED)" readOnly = {false}/>
        :
        <></>
    )
}