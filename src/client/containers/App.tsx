import React, { useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Recipes from './Recipes'
import { RecipeContainer } from './RecipeContainer'
import RecipeForm from './RecipeForm'
import HomePage from './HomePage'
import MainNavbar from './MainNavbar'


const router = createBrowserRouter([
  {
    path: "/recipes",
    element: <Recipes />, 
  }, 
  {
    path: "/recipes/:titleID",
    loader: async ({ request, params }) => {
      console.log(params);
      return fetch(
        `/api/recipes/${params.titleID}`
      ).then(response => response.json())
    },
    element: <RecipeContainer />,
  },
  {
    path: "/",
    element: <HomePage />,
  }, 
  {
    path: "/recipes/:titleID/edit",
    element: <RecipeForm />
  },
  {
    path: "/recipes/create",
    element: <RecipeForm />
  }
]);




export const App: React.FC = () => {

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sophia Recipe Blog</title>
        <link rel="canonical" href="https://takenote.dev" />
      </Helmet>
      <MainNavbar />
      <RouterProvider router = {router} />
    </HelmetProvider>
  )
}

