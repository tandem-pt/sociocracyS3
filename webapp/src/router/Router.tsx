import React from "react";
import {
    BrowserRouter,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthenticatedRoutes } from './AuthenticatedRoutes';
import { PublicRoutes } from './PublicRoutes';
import { Loading } from '../screens'

const Router = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    return <BrowserRouter>
        {isLoading ? <Loading /> : isAuthenticated ? <AuthenticatedRoutes /> : <PublicRoutes />}
    </BrowserRouter>

}

export default Router;