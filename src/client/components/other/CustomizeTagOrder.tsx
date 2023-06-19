import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "@/client/api/axios";
import { set } from "mongoose";
import React from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import queryClient from "@/client/utils/queryClient";
import * as emoji from 'node-emoji';

export default function TagEditor({ tags }: any) { 
    const [selectedTag, setSelectedTag] = useState(tags[0]);
    const tagsMutation = useMutation({
        mutationFn: ()=> updateTag({tag: selectedTag}),
        onSuccess: (data) => {
            // queryClient.invalidateQueries("tags", selectedTag._id);
        }
    })
  
    function saveTag(e: any){
        e.preventDefault();
        tagsMutation.mutate();
    }

  return (
    <>
    <h1 className="heading" >Tags Editor</h1>
    <div className="tag-editor">
        <CustomizeTagOrder tags={tags} setSelectedTag= {setSelectedTag}/> 
        <form className= "tag-form">
            <label>Category Name</label>
            <input 
                className= "tag-value"
                type= "text" 
                value= {selectedTag.value} 
                readOnly
            />
            <label>Label</label>
            <input
                className= "tag-label"
                type= "text" 
                value= {emoji.emojify(selectedTag.label || "")} 
                onChange = {(e)=> setSelectedTag({...selectedTag, label: e.target.value})}
                placeholder = "The label is the text that appears on the actual recipe tag icon. It should be short and descriptive (1-2 words). Defaults to the category name."
            />
            <label>Category Page Heading</label>
            <input 
                type="text" 
                value= {selectedTag.heading || ""} 
                placeholder= "The category page heading appears at the top of each category page. A common heading might be 'Dinner Recipes', or 'Reader Favorites'. Defaults to be the same to: Category Name + 'Recipes' (ie. Dinner Recipes), but can be more descriptive if you'd like. "
                onChange = {(e)=> setSelectedTag({...selectedTag, heading: e.target.value})}
            />
            <label>Description</label>
            <textarea 
            
                value= {selectedTag.description || ""} 
                placeholder= "This category's description will show up on the category page."
                onChange = {(e)=> setSelectedTag({...selectedTag, description: e.target.value})}
            />
            {/* <input type="color" /> */}
            {/* <button>Delete</button> */}
            <button onClick = {saveTag}>Save Changes</button>
        </form>
            
        
    </div>
    </>
  );
}

async function updateTag({tag}: any){
    console.log(tag);
    const {data} = await axios.put(`/tags/${tag._id}`, {...tag, label: emoji.unemojify(tag.label) || ""});
    return data;
}

function CustomizeTagOrder({ tags, setSelectedTag}: any) {
  const [tagsOrder, setTagsOrder] = useState(tags);
  const [newIndex, setNewIndex] = useState(-1);
  const [draggedElementIndex, setDraggedElementIndex] = useState(-1);
  const tagsMutation = useMutation({
    mutationFn: saveTagsOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries("tags");
    },
  });

  function handleDragStart(e: any) {
    e.target.classList.toggle("dragging");
    setDraggedElementIndex(e.target.dataset.index);
  }

  function handleDragEnd(e: any) {
    e.target.classList.toggle("dragging");
    tagsOrder.splice((Number(draggedElementIndex) < Number(newIndex) ? 1 : 0) + Number(newIndex), 0, tagsOrder[draggedElementIndex]);
    tagsOrder.splice(
      Number(draggedElementIndex) + (Number(draggedElementIndex) < Number(newIndex) ? 0 : 1),
      1
    );
    setDraggedElementIndex(-1);
    tagsMutation.mutate({ tags: tagsOrder.map((tag: any) => tag._id) });
  }

  function handleDragEnter(e: any) {
    setNewIndex(e.target.dataset.index);
    e.target.classList.toggle("dragover");
  }
  function handleDragLeave(e: any) {
    e.target.classList.toggle("dragover");
  }

  function handleSave() {
  }
  return (
    <ol className = "tag-list">
      {tagsOrder.map((tag: any, index: number) => (
        <li
          key={index}
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className="tag-list-item"
          data-index={index}
        >
          <p 
            className="tag-list-item-name"
            onClick= {() => setSelectedTag(tags[index])}>{tag.value}</p>
          <FontAwesomeIcon className = "tag-list-item-grab-icon" icon={faBars} />
        </li>
      ))}
    </ol>
  );
}

async function saveTagsOrder({ tags }: { tags: any[] }) {
  const { data } = await axios.post("/tags/reorder", { newOrder: tags });
  return data;
}
