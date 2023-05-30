import {isAuthenticated} from '@/client/utils/isAuthenticated';
import { Component, useState } from 'react';
import { Navigate, Outlet, Route, useLocation } from 'react-router-dom';
import useAuth from '../utils/useAuth';

interface AuthenticatedRouteProps {
    allowedRoles: number[];
}
export default function AuthenticatedRoute ({allowedRoles}: AuthenticatedRouteProps) {
  const { auth } = useAuth();
  const location = useLocation();
  return ( 
    auth?.roles?.find((role:any) => allowedRoles?.includes(role)) 
      ? <Outlet /> 
      : <Navigate to = '/users/login' state= {{from: location}} replace /> 
  )
}