import React, { useEffect } from 'react'
import { PouchDB, useDB, useGet, useFind } from "react-pouchdb/browser";
import PouchDBSync from '../PouchDBSync'
import { useOrganization } from './OrganizationContext'
export const useOrganizationDB = () => {
    const { selectedOrganization, } = useOrganization();
    return useDB(selectedOrganization?.database);
}
export const useOrganizationGet = (getParams: any) => {
    const { selectedOrganization } = useOrganization();
    return useGet(selectedOrganization?.database, getParams);
}
export const useOrganizationFind = (findParams: any) => {
    const { selectedOrganization } = useOrganization();
    return useFind(selectedOrganization?.database, findParams);
}

export type OrganizationSyncType = React.PropsWithChildren<{
    id: number
}>
const OrganizationSync = ({ id, children }: OrganizationSyncType) => {
    const { selectedOrganization, setSelectedOrganization } = useOrganization();
    useEffect(() => {
        if (id) {
            setSelectedOrganization(id);
        }
    }, [setSelectedOrganization, id])
    return <PouchDB name={selectedOrganization.database} >
        <PouchDBSync database={selectedOrganization.database}>
            {children}
        </PouchDBSync>
    </PouchDB>
}

export default OrganizationSync;