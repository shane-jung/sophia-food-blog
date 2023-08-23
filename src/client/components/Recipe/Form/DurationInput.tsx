import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

export default function DurationInput({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: any;
}) {
  const [hours, setHours] = useState(value?.match(/(?<=PT)(.*?)(?=H)/));
  const [minutes, setMinutes] = useState(value?.match(/(?<=H)(.*?)(?=M)/));

  useEffect(() => {
    setHours(value?.match(/(?<=PT)(.*?)(?=H)/)[0]);
    setMinutes(value?.match(/(?<=H)(.*?)(?=M)/)[0]);
  }, [value]);

  return (
    <Form.Group as={Col} sm={6} xl={6} className="mb-3  ">
      <Form.Label className="d-block text-center">{label}</Form.Label>
      <InputGroup>
        <Form.Control
          name={name + "Hours"}
          type="number"
          max={24}
          value={hours ? hours : 0}
          onChange={(e) => setHours(e.target.value)}
        />
        <InputGroup.Text>Hours</InputGroup.Text>
        <Form.Control
          name={name + "Minutes"}
          type="number"
          min={-1}
          max={59}
          value={minutes ? minutes : 0}
          onChange={(e) => setMinutes(e.target.value)}
        />
        <InputGroup.Text>Minutes</InputGroup.Text>
      </InputGroup>
    </Form.Group>
  );
}
