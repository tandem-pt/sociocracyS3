import React from 'react';
import {
    Switch,
    Route,
} from "react-router-dom";
import { Welcome, LoginRedirector } from '../screens';

/**
 * Routes when user is not authenticated
 */
export const PublicRoutes = () => {
    return <Switch>
        <Route path="/" redictTo="/welcome" exact />
        <Route path="/welcome" component={Welcome} exact />
        <Route path="/login" component={LoginRedirector} />
    </Switch>
}