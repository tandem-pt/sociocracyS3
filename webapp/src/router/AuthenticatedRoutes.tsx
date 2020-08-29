import React from 'react'
import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { LogoutRedirector, Organization, NewOrganization, Join, Loading } from '../screens';
import { PouchDB, PouchDBSync, useCouchAuth, Organization as OrganizationProvider, useOrganization } from '../contexts'

const AuthenticatedRoutesSwitch = () => {
    const couchAuthState = useCouchAuth();
    const { organizations } = useOrganization();
    return <PouchDB database="me">
        <PouchDB database="local">
            <Switch>
                <Route path="/logout" component={LogoutRedirector} exact />
                <Route path="/participate" component={Join} exact />
                <Route path="/getting-started" render={() => <NewOrganization />} exact />
                {
                    couchAuthState.couchLoading === false && (organizations.length === 0
                        ? <Redirect from="/" to="/getting-started" exact />
                        : <Redirect from="/" to={`/${organizations[0].id}/about`} exact />
                    )
                }
                <Switch>
                    <Route path="/new" exact>
                        <NewOrganization />
                    </Route>
                    <Route path="/:organization_id/">
                        <Organization />
                    </Route>
                </Switch>
            </Switch>
        </PouchDB>
    </PouchDB>
}
/**
 * Routes when user is authenticated
 */
const AuthenticatedRoutes = () => {
    return <OrganizationProvider fallback={<Loading />}>
        <PouchDBSync database="me">
            <AuthenticatedRoutesSwitch />
        </PouchDBSync>
    </OrganizationProvider>
}
export default AuthenticatedRoutes;