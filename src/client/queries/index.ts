
import axios from '@/client/api/axios';

export async function getAllRecipes({sort} : { sort?: string } ){
    const url = sort ? `/recipes?sort=${sort}` : '/recipes';
    const {data} = await axios.get(url);
    return data;
}  

export async function getAllTags() {
    const { data } = await axios.get("/tags");
    return data;
}
