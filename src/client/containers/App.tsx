import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Routes,
} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import '@/client/styles/index.scss'
import AllRecipes from "./AllRecipes";
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
import RecipesByTag from "./RecipesByTag";
import Settings from "./SettingsContainer";
import RecipeCategories from "./RecipeCategories";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PersistLogin />}>
      <Route path="/">
        <Route element={<RootLayout />}>
          <Route index element={<Suspense fallback={<Loading />}>
                  <HomePage />
                </Suspense>} />
          <Route path="category">
            <Route index element = {
                <Suspense fallback={<Loading />}>
                  <RecipeCategories />
                </Suspense>
              } />
            <Route path=":tag" element={
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
            <Route
              path=":titleId"
              element={
                <Suspense fallback={<Loading />}>
                  <ViewRecipePage />
                </Suspense>
              }
            />
          </Route>
          <Route path= "admin" element = {<Settings />} />

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


