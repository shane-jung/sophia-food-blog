import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import LinkContainer from "react-router-bootstrap/LinkContainer";

import SearchBar from "../components/other/SearchBar";
import LoginButton from "../components/UserManagement/LoginButton";


export default function MainNavbar() {
  return (
    <Navbar bg="primary" sticky="top" className="mb-4">
      <Container>
          <Nav 
            className="me-auto my-1 my-lg-0" 
          > 
            <NavbarBrand className = "nav-link" href = "/">Once Upon A Thyme</NavbarBrand>
            <LinkContainer to = '/'>
              <Nav.Link className = "nav-link" >Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to = "/recipes">
              <Nav.Link className= "nav-link">All Recipes</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/category/">
              <Nav.Link className= "nav-link">Categories</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link className= "nav-link">About</Nav.Link>
            </LinkContainer>

          </Nav>
          <SearchBar/>
          <LoginButton />
          
      </Container>
         
    </Navbar>
  );
}
