import { Link, useLocation } from "react-router-dom";
import useAuth from "../../utils/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { handleLogout } from "../../slices/user";
import { useEffect } from "react";

import Col from "react-bootstrap/Col";
import Button  from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";

export default function LoginButton() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const username = useSelector(
    (state: any) => state.user.username,
    shallowEqual
  );
  useEffect(() => {
    // console.log("USERNAME CHANGED: ", username)
  }, [username]);
  const dispatch = useDispatch();

  async function logout() {
    console.log("logging out");
    setAuth({});
    dispatch(handleLogout());
    try {
      const response = await axios.post(
        `/users/logout`,
        {
          email: auth.email,
        },
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    navigate(from, { replace: true });
  }
  return auth.isAuthenticated ? (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          <span>Welcome, {username}!</span>
          <FontAwesomeIcon icon= {faUser} className="ml-5 " />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2" >Another action</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout} className="font-weight-bold danger">Logout</Dropdown.Item>
        </Dropdown.Menu>
        
      </Dropdown>

  ) : (
    <Link
      to="/users/login"
      className="simple-button login-button"
      state={{ from: window.location.pathname }}
    >
      Login
    </Link>
  );
}
