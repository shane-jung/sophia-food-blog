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
import { Container, Row } from "react-bootstrap";

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
    console.log(auth);
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
        <Dropdown.Toggle className="d-flex justify-content-between align-items-center gap-2" variant="outline-success" id="dropdown-basic">
          <span>Welcome, {username}!</span>
          <FontAwesomeIcon icon= {faUser} className=" " />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          { auth?.user?.roles?.includes(8012) &&
            <Dropdown.Item href="/admin" >Manage Site</Dropdown.Item>
          }
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
