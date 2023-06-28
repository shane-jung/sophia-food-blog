import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddToBody({
    index,
    setBody,
    addSection,
  }: {
    index: number;
    setBody: any;
    addSection: any;
  }) {
    return (
      <>
        <Dropdown as={"span"} className="my-2 recipe-body-dropdown">
          <Dropdown.Toggle variant="primary">
            <FontAwesomeIcon icon={faPlus} />
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ width: "min-content" }}>
            <Dropdown.Header>Add Section</Dropdown.Header>
            <Dropdown.Item onClick={() => addSection(index, "rich")}>
              Text
            </Dropdown.Item>
            <Dropdown.Item onClick={() => addSection(index, "image")}>
              Image
            </Dropdown.Item>
            <Dropdown.Item onClick={() => addSection(index, "double-image")}>
              Double Image
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
  