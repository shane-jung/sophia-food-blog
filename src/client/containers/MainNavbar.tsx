import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import { LinkContainer } from "react-router-bootstrap";

import SearchBar from "../components/Browse/SearchBar";
import LoginButton from "../components/UserManagement/LoginButton";

export default function MainNavbar() {
  return (
    <Navbar sticky="top" className="bg-white border-bottom border-3 mb-4 px-4">
      <img
        src="https://recipe-blog-nonfood-images.s3.amazonaws.com/Thymeleafsmaller.PNG"
        width="8%"
        height="3%"
      ></img>
      <Container fluid className="mx-0">
        <Nav>
          <NavbarBrand className="nav-link" href="/">
            Once Upon A Thyme
          </NavbarBrand>
          <LinkContainer to="/recipes">
            <Nav.Link className="nav-link me-1">All Recipes</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/category">
            <Nav.Link className="nav-link me-1">Categories</Nav.Link>
          </LinkContainer>
          {/* <LinkContainer to="/blog">
            <Nav.Link className="nav-link me-1">Blog</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/about">
            <Nav.Link className="nav-link me-1">About</Nav.Link>
          </LinkContainer> */}
        </Nav>
        <div className="d-flex">
          <SearchBar />
          <LoginButton />
        </div>
      </Container>
      <img
        src="https://recipe-blog-nonfood-images.s3.amazonaws.com/Thymeleafsmaller.PNG"
        width="8%"
        height="3%"
      ></img>
    </Navbar>
  );
}
