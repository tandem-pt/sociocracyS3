import React, { useCallback } from 'react';
import Redirector from './Redirector'
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from 'react-router-dom';
const LoginRedirector = () => {
    const location = useLocation();
    const { loginWithRedirect } = useAuth0();
    const redirectLogin = useCallback(() => {
        loginWithRedirect({ appState: location.state });
    }, [loginWithRedirect, location.state]);

    return <Redirector onRedirect={redirectLogin} />
}

export default LoginRedirector;