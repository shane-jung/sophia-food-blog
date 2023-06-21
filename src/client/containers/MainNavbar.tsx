import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import SearchBar from "../components/other/SearchBar";
import LinkContainer from "react-router-bootstrap/LinkContainer";

export default function MainNavbar() {
  return (
    <Navbar bg="primary-subtle" className="mb-4">
      <Container>
          <Nav 
            className="me-auto my-1 my-lg-0"
          >
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
          <SearchBar />
          
      </Container>
         
    </Navbar>
  );
}
