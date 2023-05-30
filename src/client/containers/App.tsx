import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Routes} from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Recipes from './Recipes'
import RecipePage from '@/client/containers/RecipePage'
import LoginPage from '@/client/containers/LoginPage'
import HomePage from './HomePage'
import RootLayout from '@/client/components/layouts/RootLayout';
import { recipeLoader, emptyRecipeLoader} from '../router/recipes';
import RegisterPage from './RegisterPage'
import AuthenticatedRoute from '../components/AuthenticatedRoute'
import AuthProvider from '../contexts/AuthProvider'
import PersistLogin from '../utils/PersistLogin';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element = {<PersistLogin/>}>
      <Route path='/'>
        <Route element = {<RootLayout />}>
          <Route index element = {<HomePage/>} />
          <Route path = "recipes">
            <Route index element= {<Recipes/>}/>
            <Route element = {<AuthenticatedRoute allowedRoles = {[1000]}/>}>
              <Route path = "create" loader = {emptyRecipeLoader} element = {<RecipePage  key = 'create' />}/>
            </Route>
            <Route path = ":titleID" loader = {recipeLoader} element = {<RecipePage key = 'edit'/>}/>
          </Route>
        </Route>
          
        <Route path = "users">
          <Route path = 'login' element = {<LoginPage/>}/>
          <Route path = 'register' element = {<RegisterPage/>}/>
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
        <title>Sophia Recipe Blog</title>
        <link rel="canonical" href="/" />
      </Helmet>
      <RouterProvider router = {router}/>
    </HelmetProvider>
  )
}


