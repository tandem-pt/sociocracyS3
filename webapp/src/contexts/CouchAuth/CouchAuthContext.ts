import React, {useContext} from 'react';

export type CouchAuthLoading = {
  couchLoading: true;
};
export type CouchAuthValue = {
  jwt: string;
  user: {
    database: string;
    sub: string;
    roles: string[];
    isAdmin: (organization: string) => boolean;
  };
  couchLoading: false;
};
export type CouchAuthPayload = CouchAuthValue | CouchAuthLoading;

export type CouchAuthFunctions = {
  getCouchToken: () => Promise<{jwt: string}>;
  incrementRetry: () => void;
  resetRetry: () => void;
};

export type CouchAuthType =
  | (CouchAuthValue & CouchAuthFunctions)
  | CouchAuthLoading;

const CouchAuthContext = React.createContext<CouchAuthType>({
  couchLoading: true,
});

CouchAuthContext.displayName = 'CouchAuthContext';

export const useCouchAuth = () => useContext<CouchAuthType>(CouchAuthContext);

export default CouchAuthContext;
