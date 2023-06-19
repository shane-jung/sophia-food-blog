import MainNavbar from "@/client/containers/MainNavbar";
import Logo from "../components/other/Logo";
import { Outlet } from "react-router";
import LoginButton from "../components/UserManagement/LoginButton";
import RecipeToolbar from "../components/Recipe/Form/RecipeToolbar";

export default function RootLayout() {
  return (
    <div className="main-container">
      <LoginButton />
      <Logo />
      <RecipeToolbar />
      <MainNavbar />
      <Outlet />
    </div>
  );
}
