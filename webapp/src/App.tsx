import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core/styles';
import './App.css';
import { Auth0Provider } from "@auth0/auth0-react";
import Router from './router';
import theme from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Auth0Provider domain={"" + process.env.REACT_APP_DOMAIN_ID}
        clientId={"" + process.env.REACT_APP_CLIENT_ID}
        redirectUri={window.location.origin}
      >
        <Router />
      </Auth0Provider>
    </ThemeProvider>
  );
}

export default App;
