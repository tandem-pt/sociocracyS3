import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core/styles';
import './App.css';
import { Auth0Provider } from "@auth0/auth0-react";
import { CouchAuth, AdminLayout } from './contexts'
import Router from './router';
import theme from './theme'
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import HttpApi from 'i18next-http-backend';
import CssBaseline from '@material-ui/core/CssBaseline';

const i18nHTTP = {
  loadPath: process.env.REACT_APP_API_URL + '/locales/{{lng}}/{{ns}}.json',
};
i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,
    ns: ['translation', 'organizations', 'welcome', 'circles'],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      backends: process.env.NODE_ENV === 'production'
        ? [
          LocalStorageBackend,  // primary
          HttpApi               // fallback
        ]
        : [HttpApi],
      backendOptions: process.env.NODE_ENV === 'production'
        ? [{ expirationTime: 15 * 24 * 60 * 60 * 1000 }, i18nHTTP]
        : [i18nHTTP]
    },
    react: {
      wait: true
    }
  });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Auth0Provider domain={"" + process.env.REACT_APP_DOMAIN_ID}
        clientId={"" + process.env.REACT_APP_CLIENT_ID}
        redirectUri={window.location.origin}
        onRedirectCallback={(appState?: any): void => {
          window.history.replaceState(
            {},
            document.title,
            appState?.returnTo ? `${appState.returnTo}?${appState.search}` : window.location.pathname
          );
          window.location.reload();
        }}
      >

        <CouchAuth>
          <AdminLayout>
            <Router />
          </AdminLayout>
        </CouchAuth>
      </Auth0Provider>
    </ThemeProvider>
  );
}

export default App;
