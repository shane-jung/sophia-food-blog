import axios, { AxiosInstance } from 'axios'

export default axios.create({
    baseURL: 'http://localhost:3000/api'
}) ;

export const axiosPrivate: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});