import { setRecipe } from "@/client/slices/recipe";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faEdit,
  faImagePortrait,
  faTrash,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { set } from "mongoose";
import { useEffect, useRef, useState } from "react";
import { Button, Container, Image } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { shallowEqual, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios, { axiosPrivate } from "../../api/axios";

import Form from "react-bootstrap/Form";

export default function ImageUpload({imageURL: initialUrl} : {imageURL?: string}) {
  const recipeId = useSelector((state: any) => state.recipe._id);
  const viewMode = useSelector((state: any) => state.user.viewMode);
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>(initialUrl || "");
  const [imagePreview, setImagePreview] = useState<File>();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setImagePreview(undefined);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    setImageUrl(initialUrl || "");
  }, [recipeId]);

  const fileSelect = (event: any) => {
    event.preventDefault();
    setImagePreview(event.target.files![0]);
  };

  const uploadToS3 = async (event: any) => {
    event.preventDefault();
    const signedUrlResponse = await axios.get("/recipes/sign-s3", {
      params: {
        fileName: imagePreview?.name,
        fileType: imagePreview?.type,
      },
    });

    const { signedRequest, url } = signedUrlResponse.data;
    try {
      const result = await axios.put(signedRequest, imagePreview, {
        headers: { "Content-Type": imagePreview?.type },
      });
      console.log(result, url);
    } catch (err) {
      console.log(err);
    }

    // try {
    //   console.log(recipeId);
    //   const updateResponse = await axiosPrivate.put(`/recipes/${recipeId}`, {
    //     imageUrl: url,
    //   });
    //   console.log(updateResponse);
    // } catch (err) {
    //   console.log(err);
    // }
    console.log("SETTING RECIPE");
    dispatch(setRecipe({ type: "set-recipe", recipe: { imageUrl: url } }));
    setImage(imagePreview);
    console.log("SETTING IMAGE URL" + url);
    setImageUrl(url);
    handleClose();
  };

  async function removeImage(event: any) {
    event.preventDefault();
    if (!confirm("Are you sure you want to remove this image?")) return;
    setImage(undefined);
    setImageUrl("");
    dispatch(setRecipe({ imageUrl: "" }));

    const updateResponse = await axiosPrivate.put(`/recipes/${recipeId}`, {
      imageUrl: "",
    });
  }

  return (
    <div className="text-center" style={{ position: "relative" }}>
      {viewMode != "VIEWING" && (
        <Button
          onClick={handleShow}
          variant={"secondary"}
          className="image-upload-button"
        >
          <FontAwesomeIcon icon={faImage} />
        </Button>
      )}

      <Image
        src={imageUrl || "https://recipe-blog-data.s3.amazonaws.com/null.png"}
        className="img-fluid recipe-header-image mb-2"
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Image Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Upload a file</Form.Label>
          <Form.Control
            className="file-input"
            type="file"
            onChange={(event: any) => setImagePreview(event?.target.files[0])}
          />
          <Button variant="success" onClick={uploadToS3} className="mt-3">
            Upload Photo <FontAwesomeIcon icon={faCheck} />
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
