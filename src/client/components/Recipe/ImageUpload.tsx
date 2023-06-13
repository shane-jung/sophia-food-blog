import { setRecipe } from "@/client/slices/recipe";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faEdit, faImagePortrait, faTrash, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { set } from "mongoose";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios, { axiosPrivate } from "../../api/axios"

export default function ImageUpload(){
    const recipeId = useSelector((state: any) => state.recipe._id, (a, b) => a == b);
    const viewMode = useSelector((state: any) => state.user.viewMode);
    const initialUrl = useSelector((state:any) => state.recipe.imageUrl);
    const [image, setImage] = useState<File>();
    const [imageUrl, setImageUrl] = useState<string>();
    const [imagePreview, setImagePreview] = useState<File>();
    const [imageSelectionOpen, setImageSelectionOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(()=>{
        setImageUrl(initialUrl);
    }, [recipeId])

    const fileSelect = (event: any) => {
        event.preventDefault();
        setImagePreview(event.target.files![0]);
    }

    const uploadToS3 = async (event:any) => {  
        event.preventDefault();
        if(!imagePreview) return;
        const signedUrlResponse = await axios.get("/recipes/sign-s3", {
            params: {
                fileName: imagePreview.name,
                fileType: imagePreview.type
            },
        });

        const { signedRequest, url } = signedUrlResponse.data;


        // Uploading the image file to S3 using the signed URL
        try{
            console.log(imagePreview, signedRequest)
            const result = await axios.put(signedRequest, imagePreview, { headers: { 'Content-Type': imagePreview.type, }, });
            console.log('Response from s3', result)
        } catch(err){
            console.log(err);
        }

        try{
            console.log(recipeId)
            const updateResponse = await axiosPrivate.put(`/recipes/${recipeId}`, {
                imageUrl: url
            });
            console.log(updateResponse);

        } catch(err){
            console.log(err);
        }

        dispatch(setRecipe({imageUrl: url}));
        setImage(imagePreview)
        setImageUrl(url);
        setImagePreview(undefined);
        setImageSelectionOpen(false);
    }


    async function removeImage(event: any){
        event.preventDefault(); 
        if(!confirm("Are you sure you want to remove this image?")) return;
        setImage(undefined);
        setImageUrl("");
        dispatch(setRecipe({imageUrl:""}))

        const updateResponse = await axiosPrivate.put(`/recipes/${recipeId}`, {
            imageUrl: ""
        });
        
    }

    return (
        <div className = "header-image-container">
            {
                viewMode != "VIEWING" &&
                <>
                    <button 
                        className = "icon-button select-image"
                        onClick={(e)=>{e.preventDefault(); setImageSelectionOpen(true)}}
                    >
                        <FontAwesomeIcon icon = {faImage}/>
                    </button>

                    {   
                        imageUrl != "" && 
                        <button 
                            onClick = {removeImage}
                            className = "icon-button remove-image"
                        >
                            <FontAwesomeIcon icon = {faXmark}/>
                        </button>
                    }
                </>
            }

            <img src={imageUrl || 'https://recipe-blog-data.s3.amazonaws.com/null.png'}  className = "header-image"/>


            <dialog className = "image-selection"
                open = {imageSelectionOpen} >
                    <button 
                        className = "icon-button cancel"
                        type='button'
                        onClick = {(e)=> {e.preventDefault(); setImageSelectionOpen(false); setImagePreview(undefined)}}>
                            <FontAwesomeIcon icon = {faXmark}/>
                    </button>
                <strong>Image Upload</strong>
                
                <div className = "image-preview-container">
                    {
                        imagePreview
                        ?   <img src={URL.createObjectURL(imagePreview)} alt="" className="image-preview" />
                        :   <>  
                                <input  
                                    id = "file-input"
                                    type= "file" 
                                    className = "drop-image offscreen"
                                    onChange={fileSelect} 
                                />
                                <label htmlFor="file-input" className="container">
                                    <FontAwesomeIcon icon = {faUpload} className="upload-image" />
                                    <p><strong>Choose a file</strong> or drag and drop.</p>
                                </label>
                
                            </>

                    }
                </div>
                {
                    imagePreview &&
                    <div className="image-upload-info">
                        <p>Filename: {imagePreview?.name}</p>
                        <button 
                            className = "icon-button confirm-image"
                            onClick = {uploadToS3}>
                                <FontAwesomeIcon icon = {faCheck}/>
                        </button>
                        
                    </div>
                }
                    
            </dialog>
        </div>
    )
}