import { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";



export default function SimpleTextInput({value , name, label}: {value?: string, name?: string, label?:string}){

    return (
        <FloatingLabel label = {label} className="text-capitalize mb-3">
            <Form.Control
                name={name}
                className="mb-2"
                defaultValue={value ? value : ""}
                required
            />
        </FloatingLabel>
    )
}