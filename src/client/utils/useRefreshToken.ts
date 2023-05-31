import axios from '../api/axios' ;
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    
    const refresh = async () => {
        console.log('Using refresh token to generate new access token')
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        console.log("RESPONSE", response);

        setAuth((prev:any) => {
            console.log(JSON.stringify(prev));
            console.log(JSON.stringify(response.data));
            console.log("Setting auth context with new Access Token")
            return {...prev, accessToken: response.data.accessToken, username: response.data.username, roles: response.data.roles}
        });
        return response.data.accessToken;
    }
    return refresh;
}

export default useRefreshToken;