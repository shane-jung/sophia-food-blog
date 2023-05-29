import { useState } from "react";
import { _viewMode } from "../enums";
interface ActionButtonProps{
    buttonText: string;
    onClick: (event:any)=>void;
}

export default function ActionButton({
                            onClick,
                            buttonText
                        }:ActionButtonProps){

    return(
        <button className="edit-button simple-button" onClick={onClick}>{buttonText}</button>
    )
}