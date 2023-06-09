import { setRecipe } from "@/client/slices/recipe";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faTrash, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios, { axiosPrivate } from "../../api/axios"

export default function ImageUpload(){
    const recipe = useSelector((state: any) => state.recipe);
    const viewMode = useSelector((state: any) => state.user.viewMode);
    const [image, setImage] = useState<File>();
    const dispatch = useDispatch();


    const fileSelect = (event: any) => {
        event.preventDefault();
        setImage(event.target.files![0]);
    }

    const uploadToS3 = async (event:any) => {  
        event.preventDefault();
        if(!image) return;
        console.log(image);
        const signedUrlResponse = await axios.get("/recipes/sign-s3", {
            params: {
                fileName: image.name,
                fileType: image.type
            },
        });

        const { signedRequest, url } = signedUrlResponse.data;
        console.log(signedRequest);
        // Uploading the image file to S3 using the signed URL
        const result = await axios.put(signedRequest, image, {
            headers: {
                'Content-Type': image.type,
            },
        });
        console.log(result);

        // ,  {
            // headers: {
            //     'Content-Type': image.type,
            // },
        // }

        const updateResponse = await axiosPrivate.put(`/recipes/${recipe._id}`, {
            imageUrl: url
        });

        console.log(updateResponse);

        dispatch(setRecipe({imageUrl: url}));
    }


    async function removeImage(event: any){
        event?.preventDefault(); 
        setImage(undefined);
        dispatch(setRecipe({imageUrl:""}))
        const updateResponse = await axiosPrivate.put(`/recipes/${recipe._id}`, {
            imageUrl: ""
        });
        
    }

    return (
        <div className = "header-image-container">
            {
                viewMode != "VIEWING" &&
                <>
                    <label 
                        htmlFor="image-upload"
                        className = "image-upload-label"
                    >
                        <FontAwesomeIcon icon = {faImage}/>

                    </label>

                    <input 
                        id="image-upload" 
                        type= "file" 
                        onChange={fileSelect} 
                    />

                    <button 
                        className = "image-upload-button"
                        onClick = {uploadToS3}>
                            <FontAwesomeIcon icon = {faCheck}/>
                    </button>

                    {   
                        recipe.imageUrl && 
                        <button 
                            onClick = {removeImage}
                            className = "image-remove-button"
                        >
                            <FontAwesomeIcon icon = {faXmark}/>
                        </button>
                    }
                </>
            }

            <img src={recipe.imageUrl} alt="No image uploaded yet!"  className = "header-image"/>
        </div>
    )
}