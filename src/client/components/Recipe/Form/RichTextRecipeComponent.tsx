import { useContext, useEffect, useState } from "react";

import ReactQuill from "react-quill";
import { _viewMode } from "@/client/enums";
import { useSelector } from "react-redux";

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
        <div className="input-field-container">
          <label className="recipe-section-header">{name}</label>
          <ReactQuill
            readOnly={viewMode == "VIEWING"}
            defaultValue={initialValue}
            className={className + " input-field"}
            theme="snow"
            modules={modules}
            formats={formats}
            onChange={onChange}
          />

          <input
            aria-hidden="true"
            readOnly={true}
            className={className + " hidden-input"}
            name={name}
            value={value || ""}
            placeholder={"Recipe " + name}
          />
        </div>
      ) : (
        <>
          <h3 className="recipe-section-header">{name}</h3>
          <div
            className={className}
            dangerouslySetInnerHTML={{ __html: value || "" }}
          />
        </>
      )}
    </>
  );
}
