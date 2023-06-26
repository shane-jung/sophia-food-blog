import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";



export default function SimpleTextInput({value , name, label}: {value?: string, name?: string, label?:string}){

    return (
        <Form.Group>
            <FloatingLabel label = {label} className="text-capitalize mb-3" controlId={name}>
                <Form.Control
                name={name}
                    type="text"
                    className="mb-2"
                    defaultValue={value}
                    required
                />
            </FloatingLabel>
    </Form.Group>
    )
}