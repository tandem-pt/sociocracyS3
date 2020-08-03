import React, { useCallback } from 'react';
import Redirector from './Redirector'
import { useAuth0 } from "@auth0/auth0-react";

const LoginRedirector = () => {
    const { loginWithRedirect } = useAuth0();

    const redirectLogin = useCallback(() => {
        loginWithRedirect();
    }, [loginWithRedirect]);

    return <Redirector onRedirect={redirectLogin} />
}

export default LoginRedirector;