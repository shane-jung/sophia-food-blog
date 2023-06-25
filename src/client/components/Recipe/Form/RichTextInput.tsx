import { useContext, useEffect, useState } from "react";

import ReactQuill from "react-quill";
import { _viewMode } from "@/client/enums";
import { useSelector } from "react-redux";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Col, FormControl, Row } from "react-bootstrap";

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "link",
];

export default function RichTextInput({
  name,
  value,
  label,
  setBody,
  index
}: {
  name?: string;
  value?: string;
  label?: string;
  setBody?: any;
  index:number;
}) {

    function onChange(value:any){
        setBody((prev:any) => {
            var newBody = [...prev];
            newBody[index].value = value;
            return newBody;
        });
    }   
    const [props, setProps] = useState({
        defaultValue: value,
        theme: "snow",
        modules: modules,
        formats: formats,
        onChange: onChange,
      })

  return (
    <>
      <Form.Group className="rich-text-input my-4">
        <FloatingLabel label="Section Name" className="text-capitalize">
          <Form.Control
            type="text"
            className="section-title-input"
            placeholder="Section title"
            defaultValue={label}
          ></Form.Control>
        </FloatingLabel>

        <FormControl as={ReactQuill} {...props}></FormControl>
      </Form.Group>
    </>
  );
}
