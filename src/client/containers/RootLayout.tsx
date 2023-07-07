import MainNavbar from "@/client/containers/MainNavbar";
import { Outlet } from "react-router";
import Container from "react-bootstrap/Container";

export default function RootLayout() {
  return (
    <Container fluid className = "bg-accent px-0">
      <MainNavbar />
      <Outlet />


      <Container
        className="text-center"
        style={{ height: "150px" }}
      ></Container>
    </Container>
  );
}
