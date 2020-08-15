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
    ns: ['organizations', 'welcome', 'circles'],
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
      useSuspense: true,
      wait: true
    }
  });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Auth0Provider domain={"" + process.env.REACT_APP_DOMAIN_ID}
        clientId={"" + process.env.REACT_APP_CLIENT_ID}
        redirectUri={window.location.origin}
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
