import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "@/client/styles/index.scss";
import AllRecipes from "../components/Browse/AllRecipes";
import LoginPage from "@/client/components/UserManagement/LoginPage";
import HomePage from "./HomePage";
import RootLayout from "@/client/containers/RootLayout";
import RegisterPage from "../components/UserManagement/RegisterPage";
import AuthenticatedRoute from "../components/UserManagement/AuthenticatedRoute";
import PersistLogin from "../utils/PersistLogin";
import Loading from "../components/other/Loading";
import { Suspense, useEffect } from "react";
import CreateRecipePage from "../components/Recipe/Form/CreateRecipePage";
import RecipesByTag from "../components/Browse/RecipesByTag";
import RecipeCategories from "../components/Browse/RecipeCategories";
import AdminPage from "../components/AdminPage/AdminPage";
import RecipeContainer from "../components/Recipe/Viewing/RecipeContainer";

import "react-quill/dist/quill.snow.css";
import EditRecipePage from "../components/Recipe/Form/EditRecipePage";
import ProfilePage from "../components/UserManagement/ProfilePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PersistLogin />}>
      <Route path="/">
        <Route element={<RootLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<Loading />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route path="category">
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <RecipeCategories />
                </Suspense>
              }
            />
            <Route
              path=":tag"
              element={
                <Suspense fallback={<Loading />}>
                  <RecipesByTag />
                </Suspense>
              }
            />
          </Route>
          <Route path="recipes">
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <AllRecipes />
                </Suspense>
              }
            />
            <Route element={<AuthenticatedRoute allowedRoles={[8012]} />}>
              <Route
                path="create"
                element={
                  <Suspense fallback={<Loading />}>
                    <CreateRecipePage />
                  </Suspense>
                }
              />
            </Route>
            <Route path=":titleId">
              <Route
                index
                element={
                  <Suspense fallback={<Loading />}>
                    <RecipeContainer />
                  </Suspense>
                }
              />
              <Route
                path="edit"
                element={
                  <Suspense fallback={<Loading />}>
                    <EditRecipePage />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          <Route path= "admin" element = {<Suspense fallback={<Loading />}> <AdminPage /> </Suspense>} />
          <Route path= "profile/:id" element = {<Suspense fallback={<Loading />}> <ProfilePage /> </Suspense>} />
        </Route>

        <Route path="users">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Route>
    </Route>
  )
);

export const App: React.FC = () => {

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Once Upon a Thyme- Recipe Blog</title>
        <link rel="canonical" href="/" />
      </Helmet>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
};
