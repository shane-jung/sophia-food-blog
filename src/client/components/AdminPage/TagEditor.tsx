import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "@/client/api/axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import queryClient from "@/client/utils/queryClient";
import * as emoji from "node-emoji";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import Spinner from "react-bootstrap/Spinner";

import InputTooltip from "../Recipe/Form/InputTooltip";

export default function TagEditor({ tags }: any) {
  const [selectedTagIndex, setSelectedTagIndex] = useState(0);

  const [tagsSorted, setTagsSorted] = useState(
    tags.reduce((acc: any, tag: any) => {
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }
      acc[tag.category].push(tag);
      return acc;
    }, {})
  );

  const [category, setCategory] = useState("meals");

  const [selectedTag, setSelectedTag] = useState(tagsSorted["undefined"][0]);

  const tagsMutation = useMutation({
    mutationFn: () => updateTag({ tag: selectedTag }),
    onSuccess: (data) => {
      queryClient.invalidateQueries("tags", selectedTag._id);
    },
  });

  useEffect(() => {
    setSelectedTag(tagsSorted[category][Number(selectedTagIndex)]);
  }, [selectedTagIndex]);

  function saveTag(e: any) {
    e.preventDefault();
    tagsMutation.mutate();
  }

  return (
    <>
      <h3>Tags Editor</h3>
      <Container>
        <Row>
          <Col xs={4}>
            <Nav variant="underline" defaultActiveKey="/home">
              {Object.keys(tagsSorted).map((category: string) => (
                <Nav.Item key={category}>
                  <Nav.Link onClick={() => setCategory(category)}>
                    {category}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <h5>{category}</h5>
            <CustomizeTagOrder
              tags={tagsSorted[category]}
              setSelectedTagIndex={setSelectedTagIndex}
              selectedTagIndex={selectedTagIndex}
            />
          </Col>
          <Col xs={8}>
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Tag Name
                </Form.Label>
                <Col sm="10">
                  <Form.Control plaintext readOnly value={selectedTag.value} />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                style={{ position: "relative" }}
              >
                <Form.Label column sm="2">
                  Label
                </Form.Label>
                <Col sm="10">
                  <InputGroup>
                    <Form.Control
                      value={selectedTag.label || ""}
                      onChange={(e) =>
                        setSelectedTag({
                          ...selectedTag,
                          label: e.target.value,
                        })
                      }
                    />
                    <InputTooltip
                      text={`The label appears on the actual rectangular tags you see on a recipe. `}
                    />
                  </InputGroup>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Category Page Heading
                </Form.Label>
                <Col sm="10">
                  <InputGroup>
                    <Form.Control
                      value={selectedTag.heading || ""}
                      onChange={(e) =>
                        setSelectedTag({
                          ...selectedTag,
                          heading: e.target.value,
                        })
                      }
                    />
                    <InputTooltip
                      text={`The category page heading will appear at the top of the dedicated page for the category and it's recipes. `}
                    />
                  </InputGroup>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Description
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={selectedTag.description || ""}
                    onChange={(e) =>
                      setSelectedTag({
                        ...selectedTag,
                        description: e.target.value,
                      })
                    }
                  />
                </Col>
              </Form.Group>

              <Button
                variant="primary"
                className="text-light"
                onClick={saveTag}
              >
                Save Changes
              </Button>
              {tagsMutation.isLoading && (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

async function updateTag({ tag }: any) {
  const { data } = await axios.put(`/tags/${tag._id}`, {
    ...tag,
    label: emoji.unemojify(tag.label) || "",
  });
  return data;
}

function CustomizeTagOrder({
  tags,
  setSelectedTagIndex,
  selectedTagIndex,
}: any) {
  const [tagsOrder, setTagsOrder] = useState(tags);
  const [newIndex, setNewIndex] = useState(-1);
  const [draggedElementIndex, setDraggedElementIndex] = useState(-1);
  const tagsMutation = useMutation({
    mutationFn: saveTagsOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries("tags");
    },
  });
  useEffect(() => {
    setTagsOrder(tags);
  }, [tags]);

  function handleDragStart(e: any) {
    e.target.classList.toggle("dragging");
    setDraggedElementIndex(e.target.dataset.index);
  }

  function handleDragEnd(e: any) {
    e.target.classList.toggle("dragging");
    if (
      Number(newIndex) === -1 ||
      Number(newIndex) === Number(draggedElementIndex) ||
      newIndex == null ||
      newIndex == undefined
    )
      return;
    tagsOrder.splice(
      (Number(draggedElementIndex) < Number(newIndex) ? 1 : 0) +
        Number(newIndex),
      0,
      tagsOrder[draggedElementIndex]
    );
    tagsOrder.splice(
      Number(draggedElementIndex) +
        (Number(draggedElementIndex) < Number(newIndex) ? 0 : 1),
      1
    );
    setDraggedElementIndex(-1);
    tagsMutation.mutate({ tags: tagsOrder.map((tag: any) => tag._id) });
    setSelectedTagIndex(newIndex);
  }

  function handleDragEnter(e: any) {
    setNewIndex(e.target.dataset.index);
    e.target.classList.toggle("dragover");
  }
  function handleDragLeave(e: any) {
    e.target.classList.toggle("dragover");
  }

  return (
    <ListGroup style={{ maxHeight: "60vh", overflowY: "scroll" }}>
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
          active={selectedTagIndex === index}
          className="tag-list-item d-flex justify-content-between align-items-center"
        >
          <span
            className="text-capitalize tag-list-item-text"
            style={{ cursor: "pointer" }}
            data-index={index}
            onClick={() => setSelectedTagIndex(index)}
          >
            {tag.value}
          </span>
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
