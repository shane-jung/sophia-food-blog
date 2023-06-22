import { useContext } from "react";
import useAuth from "@/client/utils/useAuth";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Tooltip } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputGroup from "react-bootstrap/InputGroup";

export default function TitleId({ value }: { value: string }) {
  const { auth } = useAuth();
  return (
    auth.user?.roles?.includes(8012) && (
      <InputGroup>
        <FloatingLabel label="Title ID" className="mb-4">
          <Form.Control
            type="text"
            name="titleId"
            defaultValue={value}
            placeholder="Title ID"
            readOnly={false}
          />
        </FloatingLabel>
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip >
                The Title ID is the string that appears at the end of a URL. For
                example, the "cauliflower-tacos" in
                wastingmythyme.com/recipes/cauliflower-tacos. Keep it short and
                descriptive. The Title ID should be unique. Don't use any special
                characters, aside from hyphens that should separate words.
              </Tooltip>
            }
          >
            <Button variant="secondary" className= "text-light input-group-append" >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Button>
          </OverlayTrigger>
      </InputGroup>
    )
  );
}
