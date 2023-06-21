import MainNavbar from "@/client/containers/MainNavbar";
import Logo from "../components/other/Logo";
import { Outlet } from "react-router";
import LoginButton from "../components/UserManagement/LoginButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function RootLayout() {
  return (
    <Container fluid> 
      <Container >
        <Row className="align-items-center justify-content-between">
          <Col xs="auto">
            <Logo />
          </Col>
          <Col xs="auto" >
            <LoginButton />

          </Col>
        </Row>
      </Container>
      <MainNavbar />
      <Container>
        <Row>
          <Col xs={9}>
          <Outlet />
          </Col>
          <Col xs= {3}>

            <aside
            //add a border to the lft side 
            className="border-start border-2 border-dark"
            //make aside take up full height of the page
            style={ {height: 'max(100vh, 100%)'}}
            
            >
              <h3 className="text-center" 
              
              >Aside
              </h3>
            </aside>
          </Col>

        </Row>
      </Container>

    </Container>
  );
}
