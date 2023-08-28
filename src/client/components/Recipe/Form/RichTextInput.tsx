import { useState } from "react";

// import ReactQuill from "react-quill";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Tiptap from "./TipTap";

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
  index,
}: {
  name?: string;
  value?: string;
  label?: string;
  setBody?: any;
  index: number;
}) {
  function onChange(value: any) {
    setBody((prev: any) => {
      var newBody = [...prev];
      newBody[index].value = value;
      return newBody;
    });
  }
  function onLabelChange(e: any) {
    setBody((prev: any) => {
      var newBody = [...prev];
      newBody[index].name = e.target.value;
      return newBody;
    });
  }

  const [props, setProps] = useState({
    defaultValue: value,
    onChange: onChange,
  });

  return (
    <>
      <Form.Group className="rich-text-input my-4">
        <FloatingLabel
          label="Section Name"
          className="text-capitalize"
          controlId="floatingInput"
        >
          <Form.Control
            type="text"
            className="section-title-input"
            value={label}
            onChange={onLabelChange}
          ></Form.Control>
        </FloatingLabel>

        <FormControl as={Tiptap} {...props}></FormControl>
      </Form.Group>
    </>
  );
}
