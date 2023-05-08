import { useState } from "react";
import { _viewMode } from "../enums";
interface ActionButtonProps{
    buttonText: string;
    onClick: (event:any)=>void;
    buttonType: "button" | "submit" | "reset" | undefined;
}

export default function ActionButton({
                            onClick,
                            buttonText,
                            buttonType
                        }:ActionButtonProps){

    return(
        <button className="edit-button simple-button" type = {buttonType} onClick={onClick}>{buttonText}</button>
    )
}