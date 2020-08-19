import React, { useEffect, useState } from 'react';
import PouchDBSyncContext, { PouchDBSyncTypesEnum } from './PouchDBSyncContext'
import { useDB } from "react-pouchdb/browser";
import PouchDBBrowser from 'pouchdb-browser'
import { useCouchAuth } from '../CouchAuth';

export type PouchDBSyncProps = React.PropsWithChildren<{
    database: string
}>
const PouchDBSync = ({ database, children }: PouchDBSyncProps) => {
    const couchAuthState = useCouchAuth();
    const [syncState, setSyncState] = useState<PouchDBSyncTypesEnum>("paused");
    const db = useDB(database);
    useEffect(() => {
        if (couchAuthState.couchLoading === true)
            return;

        const fetchCouch = async (url: string | Request,
            opts?: RequestInit) => {
            if (!opts) opts = {};
            opts.credentials = 'include';
            opts.headers = {
                'Authorization': `Bearer ${couchAuthState.jwt}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            return PouchDBBrowser.fetch(url, opts)
        }

        const remoteDatabaseName = database === "me" ? couchAuthState.user.database : database;
        const remotePouchDB = new PouchDBBrowser(process.env.REACT_APP_COUCHDB_URL + '/' + remoteDatabaseName, {
            fetch: fetchCouch
        });
        const sync = db.sync(remotePouchDB, { live: true, retry: true });
        sync.on('change', () => {
            setSyncState('active');
            couchAuthState.resetRetry();
        }).on('paused', () => {
            setSyncState('paused');
            couchAuthState.resetRetry();
        }).on('active', () => {
            setSyncState('active');
            couchAuthState.resetRetry();
        }).on('denied', (err: any) => {
            setSyncState('denied');
            couchAuthState.incrementRetry();
            couchAuthState.getCouchToken();
            console.error(err);
        }).on('complete', () => {
            setSyncState('complete');
            couchAuthState.resetRetry();
        }).on('error', (err: any) => {
            setSyncState('error');
            console.error(err);
        });

        return () => sync.cancel();
    }, [couchAuthState, db, database]);

    return <PouchDBSyncContext.Provider value={{ syncState }} >
        {children}
    </PouchDBSyncContext.Provider >
}

export default PouchDBSync;