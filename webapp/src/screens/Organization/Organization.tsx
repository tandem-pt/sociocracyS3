import React, { lazy, Suspense, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout'
import Skeleton from '@material-ui/lab/Skeleton';
import { useParams } from 'react-router-dom';
import { OrganizationSync, useAdminLayout, useCouchAuth } from '../../contexts';
import { withTranslation, WithTranslation } from 'react-i18next';
type OrganizationType = WithTranslation;

const About = lazy(() => import('../../components/About'));
const OrganizationMembers = lazy(() => import('../../components/OrganizationMembers'));
const Fallback = () => <><Skeleton variant="text" /><Skeleton variant="text" /><Skeleton variant="text" /></>;
const Organization = ({ t }: OrganizationType) => {
    const { organization_id: organizationID } = useParams();
    const couchAuthState = useCouchAuth();
    const { setTabs, setTitle } = useAdminLayout();
    const tabElement = useCallback((title: string, path: string, Component: React.LazyExoticComponent<any>) => {
        return {
            title,
            path,
            component: couchAuthState.couchLoading ? Fallback : () => <Suspense fallback={<Fallback />}><Component document={`org:tab:${path}`} /></Suspense>
        }
    }, [couchAuthState.couchLoading]);

    useEffect(() => {
        setTabs([
            tabElement(
                t('tabs.about'),
                "about",
                About
            ),
            tabElement(
                t('tabs.members'),
                "members",
                OrganizationMembers
            )

        ])
        setTitle(t('title'))
    }, [setTabs, setTitle, couchAuthState.couchLoading, organizationID, t, tabElement]);
    return <OrganizationSync id={parseInt(organizationID)}><AdminLayout /></OrganizationSync>
}

export default withTranslation('organizations')(Organization);