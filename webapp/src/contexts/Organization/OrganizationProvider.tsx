import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import OrganizationContext, { OrganizationContextType, OrganizationType } from './OrganizationContext'
import { useAuth0 } from '@auth0/auth0-react'
export type OrganizationProps = React.PropsWithChildren<{
    fallback: JSX.Element
}>

export const useOrganization = () => useContext<OrganizationContextType>(OrganizationContext)

const Organization = ({ fallback, children }: OrganizationProps) => {
    const [organizations, setOrganizations] = useState<OrganizationType[]>();
    const [selectedOrganizationIndex, setSelectedOrganization] = useState<number>(-1);
    const { getIdTokenClaims } = useAuth0();
    const selectedOrganization = useMemo(
        () => {
            const match = organizations?.filter(({ id }) => id === selectedOrganizationIndex)
            if (match && match.length > 0) return match[0];
            return { id: -1, name: '', database: '' }
        },
        [organizations, selectedOrganizationIndex]);
    const fetchOrganization = useCallback(async () => {
        const { __raw: idToken } = await getIdTokenClaims();
        const fetchData = await fetch(process.env.REACT_APP_API_URL + "/api/v1/organizations", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + idToken,
            },
            credentials: "include"
        });
        if (fetchData.ok) {
            const response = (await fetchData.json()) as { organizations: OrganizationType[] };
            const { organizations } = response;
            console.log('setOrganizations', { organizations, fetchData })
            setOrganizations(organizations);
        } else {
            setOrganizations([]);
        }
    }, [getIdTokenClaims, setOrganizations]);

    useEffect(() => {
        fetchOrganization();
    }, [fetchOrganization])

    if (typeof organizations === 'undefined') return fallback;
    return <OrganizationContext.Provider value={{ organizations, setSelectedOrganization, selectedOrganization }}>
        {children}
    </OrganizationContext.Provider>
}

export default Organization;