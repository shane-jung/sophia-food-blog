
import axios from '@/client/api/axios';
import { useMutation, useQuery } from 'react-query';
import useAxiosPrivate from '../utils/useAxiosPrivate';

export async function getAllRecipes({sort} : { sort?: string } ){
    const url = sort ? `/recipes?sort=${sort}` : '/recipes';
    const {data} = await axios.get(url);
    return data;
}  


export const useGetAllRecipes = () => {
    const axiosPrivate = useAxiosPrivate();
    const res = useQuery({
        queryKey: ["recipes"],
        queryFn: async ()=> {
            const res = await axiosPrivate.get("/recipes");
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
    
    const res = useQuery({
        queryKey: ["users"],
        queryFn: async ()=> {
            const res = await axios.get("/users");
            return res.data;
        }
    });
    return res.data;
}

export async function getUser(id:string) {
    if(!id) return {};
    const { data } = await axios.get(`/users/${id}`);
    return data;
}