import React, { useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Routes} from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Recipes from './Recipes'
import { RecipeContainer } from './RecipeContainer'
import RecipeForm from './RecipeForm'
import HomePage from './HomePage'
import MainNavbar from './MainNavbar'
import RootLayout from '@/client/components/layouts/RootLayout';
import { recipeLoader } from '../router/recipes'
;
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element = {<RootLayout />}>
      <Route index element = {<HomePage/>} />
      <Route path = "recipes">
        <Route index element= {<Recipes/>}/>
        <Route path = "create" element = {<RecipeForm/>}/>
        <Route path = ":titleID" element ={undefined}>
          <Route index  loader = {recipeLoader } element = {<RecipeContainer/>} />
          <Route path = "edit" loader = {recipeLoader } element = {<RecipeForm/>} />
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

