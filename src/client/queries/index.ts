
import axios from '@/client/api/axios';
import { useMutation, useQuery } from 'react-query';
import useAxiosPrivate from '../utils/useAxiosPrivate';

export async function getAllRecipes({sort} : { sort?: string } ){
    const url = sort ? `/recipes?sort=${sort}` : '/recipes';
    const {data} = await axios.get(url);
    return data;
}  


export const useGetAllRecipes = () => {
    const res = useQuery({
        queryKey: ["recipes"],
        queryFn: async ()=> {
            const res = await axios.get("/recipes");
            console.log(res);
            return res.data;
        }
    });
    return res.data;
}


export async function getAllTags() {
    const { data } = await axios.get("/tags");
    return data;
}



export const useGetAllUsers = () => {
    const axiosPrivate = useAxiosPrivate();
    const res = useQuery({
        queryKey: ["users"],
        queryFn: async ()=> {
            const res = await axiosPrivate.get("/users");
            return res.data;
        }
    });
    return res.data;
}