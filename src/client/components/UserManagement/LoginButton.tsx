import { Link, useLocation } from "react-router-dom";
import useAuth from "../../utils/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { handleLogout } from "../../slices/user";

import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function LoginButton() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const username = useSelector(
    (state: any) => state.user.username,
    shallowEqual
  );
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
    navigate(from, {});
  }
  return auth.isAuthenticated ? (
      <Dropdown>
        <Dropdown.Toggle className="d-flex justify-content-between align-items-center gap-2 ms-2 " variant="primary">
          <span>Hi, {username}!</span>
          <FontAwesomeIcon icon= {faUser}  />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href={`/profile/${auth.user._id}`} >Saved Recipes</Dropdown.Item>
          { auth?.user?.roles?.includes(8012) &&
            <Dropdown.Item href="/admin" >Manage Site</Dropdown.Item>
          }
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout} className="font-weight-bold danger">Logout</Dropdown.Item>
        </Dropdown.Menu>
        
      </Dropdown>

  ) : (

    <Button variant="primary"
      href="/users/login"
      className="ms-2"
      // className="login-button"
      // state={{ from: window.location.pathname }}
    >
      Login
    </Button>
  );
}
