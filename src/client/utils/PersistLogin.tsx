import { Outlet } from "react-router";
import { useState, useEffect, useMemo } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useDispatch } from "react-redux";
import user, { handleLogin, handleLogout } from "../slices/user";
import axios from "../api/axios";
import Loading from "../components/other/Loading";

const PersistLogin = () => {

  
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      // console.log('verifying refresh token');
      try {
        const result = await refresh();
      } catch (err: any) {
        console.log("Logging out");
        dispatch(handleLogout());
      } finally {
        setIsLoading(false);
      }
    };
    verifyRefreshToken();
  }, []);

  useMemo(() => {
    async function getUser() {
      const getUser = await axios.get(`/users/${auth.user._id}`);
      // console.log(getUser.data)
      dispatch(handleLogin(getUser.data));
      // console.log(getUser.data);
    }
    if (auth.user) getUser();
  }, [auth.user]);

  return isLoading ? <Loading /> : <Outlet />;
};

export default PersistLogin;
