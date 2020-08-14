import React, {useContext} from 'react';
export type PouchDBSyncTypesEnum =
  | 'active'
  | 'paused'
  | 'denied'
  | 'complete'
  | 'error';
export type PouchDBSyncType = {
  syncState: PouchDBSyncTypesEnum;
};

const PouchDBSyncContext = React.createContext<PouchDBSyncType>({
  syncState: 'paused',
});

PouchDBSyncContext.displayName = 'PouchDBSyncContext';

export const usePouchDBSync = () =>
  useContext<PouchDBSyncType>(PouchDBSyncContext);

export default PouchDBSyncContext;
