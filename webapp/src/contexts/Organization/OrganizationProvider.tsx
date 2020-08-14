import React, { useContext } from 'react';
import { PouchDB, useDB, useGet, useFind } from "react-pouchdb/browser";
import PouchDBSync from '../PouchDBSync'
import OrganizationContext, { OrganizationContextType } from './OrganizationContext'
export type OrganizationProps = React.PropsWithChildren<OrganizationContextType>

export const useOrganizationDB = () => {
    const { organization } = useContext<OrganizationContextType>(OrganizationContext);
    return useDB(organization);
}
export const useOrganizationGet = (getParams: any) => {
    const { organization } = useContext<OrganizationContextType>(OrganizationContext);
    return useGet(organization, getParams);
}
export const useOrganizationFind = (findParams: any) => {
    const { organization } = useContext<OrganizationContextType>(OrganizationContext);
    return useFind(organization, findParams);
}

const Organization = ({ organization, children }: OrganizationProps) => {
    return <OrganizationContext.Provider value={{ organization }}>
        <PouchDB name={organization} >
            <PouchDBSync database={organization}>
                {children}
            </PouchDBSync>
        </PouchDB>
    </OrganizationContext.Provider>
}

export default Organization;