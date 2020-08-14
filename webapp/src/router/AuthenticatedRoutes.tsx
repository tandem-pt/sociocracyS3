import React from 'react'
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { LogoutRedirector, Circle, NewOrganization } from '../screens';
import { PouchDB, PouchDBSync, useCouchAuth } from '../contexts'




const AuthenticatedRoutesSwitch = () => {
    const couchAuthState = useCouchAuth();
    return <PouchDB database={"me"}>
        <Switch>
            <Route path="/logout" component={LogoutRedirector} exact />
            <Route path="/getting-started" render={(props) => <NewOrganization {...props} />} exact />
            {
                couchAuthState.couchLoading === false
                    && couchAuthState.user.organizations.length === 0
                    ? <Redirect from="/" to="/getting-started" exact />
                    : <Redirect from="/" to="/organizations/new" exact />}
            <Switch>
                <Route path="/organizations/new" exact>
                    <NewOrganization />
                </Route>
                <Route path="/organizations/:organization_id/">
                    <Circle />
                </Route>
            </Switch>
        </Switch>
    </PouchDB>
}
/**
 * Routes when user is authenticated
 */
export const AuthenticatedRoutes = () => {
    return <PouchDBSync database="me">
        <AuthenticatedRoutesSwitch />
    </PouchDBSync >
}