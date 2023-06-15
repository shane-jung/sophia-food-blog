import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Routes,
} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Recipes from "./Recipes";
import LoginPage from "@/client/components/UserManagement/LoginPage";
import HomePage from "./HomePage";
import RootLayout from "@/client/containers/RootLayout";
import RegisterPage from "../components/UserManagement/RegisterPage";
import AuthenticatedRoute from "../components/UserManagement/AuthenticatedRoute";
import PersistLogin from "../utils/PersistLogin";
import Loading from "../components/other/Loading";
import { Suspense } from "react";
import CreateRecipePage from "./CreateRecipePage";
import ViewRecipePage from "./ViewRecipePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PersistLogin />}>
      <Route path="/">
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="recipes">
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  {" "}
                  <Recipes />{" "}
                </Suspense>
              }
            />
            <Route element={<AuthenticatedRoute allowedRoles={[8012]} />}>
              <Route
                path="create"
                element={
                  <Suspense fallback={<Loading />}>
                    {" "}
                    <CreateRecipePage />{" "}
                  </Suspense>
                }
              />
            </Route>
            <Route
              path=":titleId"
              element={
                <Suspense fallback={<Loading />}>
                  {" "}
                  <ViewRecipePage />{" "}
                </Suspense>
              }
            />
          </Route>
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
