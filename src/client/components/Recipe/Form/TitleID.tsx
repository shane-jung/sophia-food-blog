import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import InputGroup from "react-bootstrap/InputGroup";
import InputTooltip from "./InputTooltip";

export default function TitleId({ value }: { value: string }) {
  return (
    <InputGroup className="mb-3">
      <FloatingLabel label="Title ID">
        <Form.Control
          type="text"
          name="titleId"
          defaultValue={value}
          placeholder="Title ID"
          readOnly={false}
        />
      </FloatingLabel>
      <InputTooltip
        text={`The Title ID is the string that appears at the end of a URL. For
                  example, the "cauliflower-tacos" in
                  wastingmythyme.com/recipes/cauliflower-tacos. Keep it short and
                  descriptive. The Title ID should be unique. Don't use any special
                  characters, aside from hyphens that should separate words.`}
      />
    </InputGroup>
  );
}
