import React, { Suspense, lazy } from "react";
import {
    BrowserRouter,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Loading } from '../screens'
const AuthenticatedRoutes = lazy(() => import('./AuthenticatedRoutes'))
const PublicRoutes = lazy(() => import('./PublicRoutes'))
const Router = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    return <BrowserRouter>
        <Suspense fallback={<Loading />}>
            {isLoading ? <Loading /> : isAuthenticated ? <AuthenticatedRoutes /> : <PublicRoutes />}
        </Suspense>
    </BrowserRouter>
}

export default Router;