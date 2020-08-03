import React, { useCallback } from 'react';
import Redirector from './Redirector'
import { useAuth0 } from "@auth0/auth0-react";

const LogoutRedirector = () => {
    const { logout } = useAuth0();

    const redirectLogout = useCallback(() => {
        logout();
    }, [logout]);

    return <Redirector onRedirect={redirectLogout} />
}

export default LogoutRedirector;