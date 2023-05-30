import axios from '../api/axios' ;
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    
    const refresh = async () => {
        console.log('using refresh token to generate new access token')
        const response = await axios.get('/refresh', {
            withCredentials: true
        });

        setAuth((prev:any) => {
            // console.log(JSON.stringify(prev));
            // console.log(JSON.stringify(response.data.accessToken));
            return {...prev, accessToken: response.data.accessToken}
        });
        return response.data.accessToken;
    }
    return refresh;
}

export default useRefreshToken;