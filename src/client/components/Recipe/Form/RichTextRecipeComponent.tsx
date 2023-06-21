import { useContext, useEffect, useState } from "react";

import ReactQuill from "react-quill";
import { _viewMode } from "@/client/enums";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { FloatingLabel } from "react-bootstrap";

interface RichTextRecipeComponentProps {
  className: string;
  initialValue: string;
  name: string;
}
export default function RichTextRecipeComponent({
  className,
  initialValue,
  name,
}: RichTextRecipeComponentProps) {
  const viewMode = useSelector((state: any) => state.user.viewMode);
  const [value, setValue] = useState(initialValue);
  const recipeId = useSelector((state: any) => state.recipe._id);

  useEffect(() => {
    setValue(initialValue);
  }, [viewMode, recipeId]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
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
    "image",
  ];

  function onChange(newValue: string) {
    setValue(newValue);
  }

  return (
    <>
      {viewMode != "VIEWING" ? (
       <>
          <Form.Group className="mb-4">
            <Form.Label className="text-capitalize">
              {name}
            </Form.Label>
            <ReactQuill
              readOnly={viewMode == "VIEWING"}
              defaultValue={initialValue}
              theme="snow"
              modules={modules}
              formats={formats}
              onChange={onChange}
            />  
          </Form.Group>

          <input
            aria-hidden="true"
            readOnly={true}
            className={className + " hidden-input"}
            name={name}
            value={value || ""}
            placeholder={"Recipe " + name}
          />
          </>
      ) : (
        <>
          <h3 className= "text-center text-capitalize">{name}</h3>
          <div
            className={"fw-normal text-body-primary lh-lg fs-5"}
            dangerouslySetInnerHTML={{ __html: value || "" }}
          />
        </>
      )}
    </>
  );
}
