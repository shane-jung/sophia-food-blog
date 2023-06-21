import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "@/client/api/axios";
import { set } from "mongoose";
import React from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import queryClient from "@/client/utils/queryClient";
import * as emoji from 'node-emoji';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Form, ListGroup } from "react-bootstrap";

export default function TagEditor({ tags }: any) { 
    const [selectedTagIndex, setSelectedTagIndex] = useState(0);
    const [selectedTag, setSelectedTag] = useState(tags[0]);
    const tagsMutation = useMutation({
        mutationFn: ()=> updateTag({tag: selectedTag}),
        onSuccess: (data) => {
            // queryClient.invalidateQueries("tags", selectedTag._id);
        }
    })
    useEffect(()=>{
        console.log("INDEX CHANGED", Number(selectedTagIndex))
        setSelectedTag(tags[Number(selectedTagIndex)]);
    }, [selectedTagIndex])

    useEffect(()=>{
      console.log(selectedTag)
},[selectedTag])
  
    function saveTag(e: any){
        e.preventDefault();
        tagsMutation.mutate();
    }

  return (
    <>
    <h3 >Tags Editor</h3>
    <Container >
      <Row>
        <Col xs={4}>
          <CustomizeTagOrder tags={tags} setSelectedTagIndex= {setSelectedTagIndex} selectedTagIndex = {selectedTagIndex}/> 
        </Col>
        <Col xs={8}>
          <Form>
            <Form.Group as= {Row} className= "mb-3">
                <Form.Label column sm="2">
                    Tag Name
                </Form.Label> 
                <Col sm="10">
                    <Form.Control plaintext readOnly value={selectedTag.value} />
                </Col>
            </Form.Group>
            <Form.Group as= {Row} className= "mb-3" style={{"position": "relative"}}>
                <Form.Label column sm="2">
                    Label
                </Form.Label> 
                <Col sm="10">
                    <Form.Control value={selectedTag.label || ""} onChange =  {(e)=> setSelectedTag({...selectedTag, label: e.target.value})} />
                    
                </Col>
                <Form.Control.Feedback tooltip>Good work</Form.Control.Feedback>
            </Form.Group>
             
                  {/* placeholder = "The label is the text that appears on the actual recipe tag icon. It should be short and descriptive (1-2 words). Defaults to the category name." */}
            <Form.Group as= {Row} className= "mb-3">
                <Form.Label column sm="2">
                    Category Page Heading
                </Form.Label> 
                <Col sm="10">
                    <Form.Control value={selectedTag.heading || ""} onChange =  {(e)=> setSelectedTag({...selectedTag, heading: e.target.value})} />
                </Col>
            </Form.Group>
              
                  {/* placeholder= "The category page heading appears at the top of each category page. A common heading might be 'Dinner Recipes', or 'Reader Favorites'. Defaults to be the same to: Category Name + 'Recipes' (ie. Dinner Recipes), but can be more descriptive if you'd like. " */}
            <Form.Group as= {Row} className= "mb-3">
                <Form.Label column sm="2">
                    Description
                </Form.Label> 
                <Col sm="10">
                    <Form.Control as ="textarea"  rows ={8} value={selectedTag.description || ""} onChange =  {(e)=> setSelectedTag({...selectedTag, description: e.target.value})} />
                </Col>
            </Form.Group>
                  {/* // placeholder= "This category's description will show up on the category page." */}
              {/* <input type="color" /> */}
              {/* <button>Delete</button> */}
              <Button variant="success" onClick = {saveTag}>Save Changes</Button>
          </Form>
        </Col>
      </Row>
        
            
        
    </Container>
    </>
  );
}

async function updateTag({tag}: any){
    console.log(tag);
    const {data} = await axios.put(`/tags/${tag._id}`, {...tag, label: emoji.unemojify(tag.label) || ""});
    return data;
}

function CustomizeTagOrder({ tags, setSelectedTagIndex, selectedTagIndex}: any) {
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
    if(Number(newIndex) === -1 || Number(newIndex) === Number(draggedElementIndex)) return;
    tagsOrder.splice((Number(draggedElementIndex) < Number(newIndex) ? 1 : 0) + Number(newIndex), 0, tagsOrder[draggedElementIndex]);
    tagsOrder.splice(
      Number(draggedElementIndex) + (Number(draggedElementIndex) < Number(newIndex) ? 0 : 1),
      1
    );
    setDraggedElementIndex(-1);
    tagsMutation.mutate({ tags: tagsOrder.map((tag: any) => tag._id) });
    setSelectedTagIndex(newIndex);
    console.log(newIndex);
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
    <ListGroup 
      style={{ maxHeight: "60vh", overflowY: "scroll" }}
    >
      {tagsOrder.map((tag: any, index: number) => (
        <ListGroup.Item
          tabIndex={0}
          key={index}
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          data-index={index}
          active = {selectedTagIndex === index}
          className="tag-list-item d-flex justify-content-between align-items-center"

        >
          <span
            className="text-capitalize"
            style={{ cursor: "pointer" }}
            data-index={index}
            onClick= {() => setSelectedTagIndex(index)}>{tag.value}</span>
          <FontAwesomeIcon

            icon={faBars} 
            style={{ cursor: "grab" }}
            data-index={index}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

async function saveTagsOrder({ tags }: { tags: any[] }) {
  const { data } = await axios.post("/tags/reorder", { newOrder: tags });
  return data;
}
