import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InputTooltip({ text }: { text: string }) {
  return (
    <OverlayTrigger
      placement={"top"}
      overlay={<Tooltip style={{ maxWidth: "400px" }}>{text}</Tooltip>}
    >
      <Button variant="primary" className="text-light">
        <FontAwesomeIcon icon={faQuestionCircle} />
      </Button>
    </OverlayTrigger>
  );
}
