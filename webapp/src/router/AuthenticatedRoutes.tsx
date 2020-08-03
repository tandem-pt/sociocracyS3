import React from 'react'
import {
    Switch,
    Route,
} from "react-router-dom";
import { PaperBase } from '../components';
import { LogoutRedirector } from '../screens';

/**
 * Routes when user is authenticated
 */
export const AuthenticatedRoutes = () => {
    return <Switch >
        <Route path="/" component={PaperBase} exact />
        <Route path="/logout" component={LogoutRedirector} exact />
    </Switch>
}