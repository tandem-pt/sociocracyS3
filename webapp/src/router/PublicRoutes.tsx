import React from 'react';
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { Welcome, LoginRedirector, SignInOrJoin } from '../screens';

/**
 * Routes when user is not authenticated
 */
const PublicRoutes = () => {
    return <Switch>
        <Redirect from="/" to="/welcome" exact />
        <Route path="/welcome" component={Welcome} exact />
        <Route path="/participate" component={SignInOrJoin} exact />
        <Route path="/login" component={LoginRedirector} />
    </Switch>
}
export default PublicRoutes;