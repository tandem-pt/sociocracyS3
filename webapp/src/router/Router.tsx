import React, { Suspense, lazy } from "react";
import {
    BrowserRouter
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Loading } from '../screens'
const AuthenticatedRoutes = lazy(() => import('./AuthenticatedRoutes'))
const PublicRoutes = lazy(() => import('./PublicRoutes'))
const Router = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    const location = window.location as any;
    location.state = location.state || {};
    // Don't mount router if auth0 state returnTo is set in location
    if (isAuthenticated && location?.state && 'returnTo' in location?.state) {
        return null;
    }
    return <BrowserRouter>
        <Suspense fallback={<Loading />}>
            {isLoading ? <Loading /> : isAuthenticated ? <AuthenticatedRoutes /> : <PublicRoutes />}
        </Suspense>
    </BrowserRouter>
}

export default Router;