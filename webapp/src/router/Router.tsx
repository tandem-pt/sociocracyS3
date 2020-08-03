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
    if (isLoading) {
        return <Loading><span role="img" aria-label="We verify your profile">🤖</span>&nbsp;Fetching your profile</Loading>;
    }
    return <BrowserRouter>
        {isAuthenticated ? <AuthenticatedRoutes /> : <PublicRoutes />}
    </BrowserRouter>

}
 
export default Router;