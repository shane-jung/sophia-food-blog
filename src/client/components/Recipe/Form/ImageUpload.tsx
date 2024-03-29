import { setRecipe } from "@/client/slices/recipe";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "../../../api/axios";

import Form from "react-bootstrap/Form";

export default function ImageUpload({
  imageUrl: initialUrl,
  setBody,
  index,
}: {
  imageUrl?: string;
  setBody?: any;
  index: number;
}) {
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
    } catch (err) {
      console.log(err);
    }

    if (index == -1) dispatch(setRecipe({ type: "set-recipe", imageUrl: url }));
    setImage(imagePreview);
    setImageUrl(url);
    handleClose();
    if (index != -1) {
      setBody((prevBody: any) => {
        const newBody = [...prevBody];
        newBody[index].value = url;
        return newBody;
      });
    }
  };

  return (
    <div className="text-center my-4" style={{ position: "relative" }}>
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
