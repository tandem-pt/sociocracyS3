import React from 'react'
import {
    Switch,
    Route,
} from "react-router-dom";
import { LogoutRedirector, Circle } from '../screens';

/**
 * Routes when user is authenticated
 */
export const AuthenticatedRoutes = () => {
    return <Switch >
        <Route path="/logout" component={LogoutRedirector} exact />
        <Route path="/">
            <Circle />
        </Route>
    </Switch>
}