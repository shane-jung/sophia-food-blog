import { _viewMode } from "@/client/enums";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { FloatingLabel } from "react-bootstrap";

const dictionary: {[key:string]: string} = {
  "title": "display-3 ",
  "cardTitle": "h2",
  "subtitle": "lead",
  "titleId": "h3",
};

interface SimpleTextRecipeComponentProps {
  initialValue: string;
  name: string;
}
export default function SimpleTextRecipeComponent({
  initialValue,
  name,
}: SimpleTextRecipeComponentProps) {
  const viewMode = useSelector((state: any) => state.user.viewMode);
  const [value, setValue] = useState(initialValue);
  const recipeId = useSelector((state: any) => state.recipe._id);

  useEffect(() => {
    setValue(initialValue);
  }, [recipeId, viewMode]);

  return (
    <>
      {viewMode !== "VIEWING" ? (
        // <div className="input-field-container">
        <FloatingLabel label = {name} className="text-capitalize">
          <Form.Control
            name={name}
            placeholder={"Recipe " + name}
            className={dictionary[name] + " mb-2"}
            defaultValue={initialValue}
            readOnly={viewMode == "VIEWING"}
            required

          />
          </FloatingLabel>
        // </div>
      ) : (
        <div 
          className={ dictionary[name]  }
        >{initialValue}</div>
      )}
    </>
  );
}

