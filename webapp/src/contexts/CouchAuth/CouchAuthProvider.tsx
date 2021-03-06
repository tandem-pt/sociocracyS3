import React, { useEffect, useState, useCallback } from 'react';
import CouchAuthContext, { CouchAuthPayload } from './CouchAuthContext'
import { useAuth0 } from "@auth0/auth0-react";
import jwtDecode from 'jwt-decode';

export type CouchAuthProps = React.PropsWithChildren<{
}>
const CouchAuth = ({ children }: CouchAuthProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [couchAuthState, setCouchAuthState] = useState<CouchAuthPayload>({ couchLoading: true });
    const [retry, setRetry] = useState<number>(0);
    const { isAuthenticated, isLoading: isAuthLoading, getIdTokenClaims, logout } = useAuth0();

    const getCouchToken = useCallback(async () => {
        if (retry > 5) {
            console.error('Denied to connect to couch after 5 retries, logout');
            // We tried more than 5 times to re-connect,
            // give up and logout
            await logout();
        }
        setIsLoading(true);
        if (retry > 1) {
            console.log('Try to connect to couch in 3sec');
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        const { __raw: idToken } = await getIdTokenClaims();
        const fetchData = await fetch(process.env.REACT_APP_API_URL + "/api/v1/couch/token", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + idToken,
            },
            credentials: "include"
        });
        const { jwt } = await fetchData.json();
        if (!jwt) {
            throw new Error('400 /api/v1/couch/token');
        }
        const decodedJWT = jwtDecode(jwt) as any;
        const user = {
            sub: "" + decodedJWT.sub,
            roles: decodedJWT["_couchdb.roles"] as Array<string>,
            database: "" + decodedJWT['https://sociocracy30.io/userDB'],
            isAdmin: (database: string) => user.roles.includes(`admin.${database}`)
        }
        const state = { jwt: `${jwt}`, user, couchLoading: false };
        setCouchAuthState(state);
        setIsLoading(false);
        return state;
    }, [getIdTokenClaims, setCouchAuthState, logout, retry, setIsLoading]);


    useEffect(() => {
        if (!isAuthenticated || isAuthLoading) return;
        if (!isLoading && couchAuthState.couchLoading === true) {
            getCouchToken();
        }
    }, [isAuthenticated, isAuthLoading, getCouchToken, isLoading, couchAuthState.couchLoading]);

    return <CouchAuthContext.Provider value={
        couchAuthState.couchLoading === true
            ? { couchLoading: couchAuthState.couchLoading }
            : {
                jwt: couchAuthState.jwt,
                user: couchAuthState.user,
                couchLoading: false,
                getCouchToken,
                incrementRetry: () => setRetry(retry + 1),
                resetRetry: () => setRetry(0)
            }} >
        {children}
    </CouchAuthContext.Provider >
}

export default CouchAuth;