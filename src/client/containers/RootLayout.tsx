import MainNavbar from "@/client/containers/MainNavbar";
import Logo from "../components/other/Logo";
import { Outlet } from "react-router";
import LoginButton from "../components/UserManagement/LoginButton";

export default function RootLayout() {
  return (
    <div className="main-container">
      <LoginButton />
      <Logo />
      <MainNavbar />
      <Outlet />
    </div>
  );
}
