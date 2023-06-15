import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    // console.log('Using refresh token to generate new access token')
    try {
      const response = await axios.get("/refresh", {
        withCredentials: true,
      });
      // console.log("RESPONSE", response);
      // console.log("setting auth");
      setAuth((prev: any) => {
        // console.log(JSON.stringify(prev));
        // console.log(JSON.stringify(response.data));
        // console.log("Setting auth context with new Access Token")
        // console.log(response.data);
        return { ...prev, isAuthenticated: true, user: response.data.user };
      });
      return response.data.accessToken;
    } catch (err) {
      console.log(err);
    }
  };
  return refresh;
};

export default useRefreshToken;
