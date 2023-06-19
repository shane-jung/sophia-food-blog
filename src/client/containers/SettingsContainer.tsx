import { useQuery } from "react-query";
import axios from "../api/axios";
import TagEditor from "../components/other/TagEditor";


export default function Settings(){
    const { data: tags } = useQuery(["tags"], getAllTags);
    console.log(tags);


    return (
        <TagEditor tags={tags}/>
    )
}

async function getAllTags() {
    const { data } = await axios.get("/tags");
    return data;
  }