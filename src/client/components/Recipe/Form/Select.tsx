import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "@/client/api/axios";

import { useQuery } from "react-query";
import Form from "react-bootstrap/Form";
import * as emoji from "node-emoji";
export default function Select({
  selected: initialSelected,
  setSelected,
}: {
  selected?: string[];
  setSelected: any;
}) {
  const allTags = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
  }).data;

  const [options, setOptions] = useState<any>(
    allTags.map((tag: any) => {
      return { value: tag._id, label: tag.value, _id: tag._id };
    })
  );
  console.log(initialSelected);

  async function createOption(option: string) {
    try {
      const response = await axios.post("/tags/create", {
        tag: option,
      });
      options.push({ value: option, label: option, _id: response.data });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="mb-4" style={{ zIndex: "200", position: "relative" }}>
      <Form.Label>Tags</Form.Label>
      <CreatableSelect
        closeMenuOnSelect={false}
        isMulti
        options={options}
        onCreateOption={createOption}
        defaultValue={initialSelected?.map((tag: any) => {
          return {
            value: tag,
            label: emoji.emojify(
              allTags[allTags.map((tag: any) => tag._id).indexOf(tag)].label
            ),
            _id: tag,
          };
        })}
        onChange={(selected: any) => {
          setSelected(selected.map((tag: any) => tag._id));
        }}
      />
    </div>
  );
}

async function getAllTags() {
  const { data } = await axios.get(`/tags`);
  return data;
}
