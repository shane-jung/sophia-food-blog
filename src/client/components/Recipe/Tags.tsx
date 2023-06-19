import Select from "react-select";
import { useEffect, useMemo, useState } from "react";
import CreatableSelect, { useCreatable } from "react-select/creatable";
import { useDispatch, useSelector } from "react-redux";
import { setRecipe } from "@/client/slices/recipe";
import axios from "../../api/axios";

import { useQuery } from "react-query";
import { Link } from "react-router-dom";

import * as emoji from "node-emoji";

export default function Tags() {
  const dispatch = useDispatch();
  // const recipeId = useSelector((state:any) => state.recipe._id);
  const viewMode = useSelector((state: any) => state.user.viewMode);
  const savedTags = useSelector((state: any) => state.recipe.tags);
  const selectedTags = useSelector((state: any) => state.recipe.selectedTags);
  const [selected, setSelected] = useState<any>([]);
  const [options, setOptions] = useState<any>([]);
  const [tagRender, setTagRender] = useState<any>([]);

  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
  });

  useEffect(() => {
    if (viewMode == "VIEWING") {
      setSelected(options.filter((tag: any) => savedTags.includes(tag._id)));
      dispatch(
        setRecipe({ type: "set-recipe", recipe: { selectedTags: savedTags } })
      );
    }
  }, [viewMode]);

  useEffect(() => {
    const options = data.map((tag: any) => {
      return { value: tag.value, label: tag.value, _id: tag._id };
    });
    setOptions(options);
  }, [data]);

  useEffect(() => {
    setSelected(options.filter((tag: any) => savedTags.includes(tag._id)));
  }, [options]);

  useEffect(() => {
    dispatch(
      setRecipe({
        type: "set-recipe",
        recipe: { selectedTags: selected.map((tag: any) => tag._id) },
      })
    );
  }, [selected]);

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

  function onChange(e: any, data: any) {
    // console.log(e, data);
    if (data.action == "clear") {
      setSelected([]);
    } else if (data.action == "select-option") {
      setSelected([...selected, data.option]);
    } else if (data.action == "remove-value") {
      setSelected(
        selected.filter((tag: any) => tag._id != data.removedValue._id)
      );
    } else if (data.action == "create-option") {
      createOption(data.option.value);
      setSelected([...selected, data.option]);
    }
  }

  useEffect(() => {
    setTagRender(
      selected.map((tag: any) => {
        return (
          <div key={tag._id}>
            <Link
              className="recipe-tag"
              to={`/category/${tag.label.toLowerCase().replace(" ", "-")}`}
            >
              {emoji.emojify(tag.label)}
            </Link>
          </div>
        );
      })
    );
  }, [selected]);

  return viewMode != "VIEWING" ? (
    <div className="tags-select-container">
      <label>Tags</label>
      <CreatableSelect
        name="tags"
        closeMenuOnSelect={false}
        isMulti
        onChange={onChange}
        options={options}
        onCreateOption={createOption}
        value={selected}
      />
    </div>
  ) : (
    <div className="recipe-tags">{tagRender}</div>
  );
}

async function getAllTags({ queryKey }: any) {
  const { data } = await axios.get(`/tags`);
  return data;
}
