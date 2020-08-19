import React from 'react'
import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { LogoutRedirector, Organization, NewOrganization, Join } from '../screens';
import { PouchDB, PouchDBSync, useCouchAuth } from '../contexts'

const AuthenticatedRoutesSwitch = () => {
    const couchAuthState = useCouchAuth();

    return <PouchDB database={"me"}>
        <Switch>
            <Route path="/logout" component={LogoutRedirector} exact />
            <Route path="/participate" component={Join} exact />
            <Route path="/getting-started" render={(props) => <NewOrganization />} exact />
            {
                couchAuthState.couchLoading === false && (couchAuthState.user.organizations.length === 0
                    ? <Redirect from="/" to="/getting-started" exact />
                    : <Redirect from="/" to={`/organizations/${couchAuthState.user.organizations[0][0]}/about`} exact />
                )
            }
            <Switch>
                <Route path="/organizations/new" exact>
                    <NewOrganization />
                </Route>
                <Route path="/organizations/:organization_id/">
                    <Organization />
                </Route>
            </Switch>
        </Switch>
    </PouchDB>
}
/**
 * Routes when user is authenticated
 */
const AuthenticatedRoutes = () => {
    return <PouchDBSync database="me">
        <AuthenticatedRoutesSwitch />
    </PouchDBSync >
}
export default AuthenticatedRoutes;