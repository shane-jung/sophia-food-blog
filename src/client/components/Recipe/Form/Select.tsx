import CreatableSelect from "react-select/creatable";
import axios from "@/client/api/axios";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useQuery } from "react-query";
export default function Select({
  selectedIds = [],
  category,
}: {
  selectedIds: string[];
  category: string;
}) {
  const tags = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
  }).data;

  const [options, setOptions] = useState(
    tags
      .filter((tag: any) => tag.category === category)
      .map((tag: any) => ({ value: tag._id, label: tag.label }))
  );
  const [selected, setSelected] = useState(
    selectedIds
      .map((id: string) => tags.find((tag: any) => tag._id === id))
      .map((tag: any) => ({ value: tag._id, label: tag.label }))
  );

  async function createOption(option: string) {
    try {
      const response = await axios.post(`/tags/create`, {
        tag: option,
        category,
      });
      setOptions([...options, { value: response.data, label: option }]);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="mb-4" style={{ position: "relative" }}>
      <Form.Label>{category}</Form.Label>
      <CreatableSelect
        name={category}
        closeMenuOnSelect={false}
        isMulti
        required={false}
        options={options}
        onCreateOption={createOption}
        defaultValue={selected}
        onChange={(selected: any) => {
          setSelected(selected);
        }}
      />
    </div>
  );
}

async function getAllTags() {
  const { data } = await axios.get(`/tags`);
  return data;
}
