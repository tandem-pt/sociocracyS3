import React, { lazy, Suspense, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout'
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from 'react-router-dom';
import { Organization as OrganizationProvider, useAdminLayout, useCouchAuth } from '../../contexts';
import { withTranslation, WithTranslation } from 'react-i18next';
type OrganizationType = WithTranslation;

const Learn = lazy(() => import('../../components/Learn'));
const OrganizationMembers = lazy(() => import('../../components/OrganizationMembers'));
const fallback = <CircularProgress size={50} />;
const Organization = ({ t }: OrganizationType) => {
    const { organization_id: organizationID } = useParams();
    const couchAuthState = useCouchAuth();
    const { setTabs, setTitle } = useAdminLayout();
    useEffect(() => {
        if (couchAuthState.couchLoading === true) return;
        setTabs([
            {
                title: t('tabs.about'),
                path: "about",
                component: () => (<div>About</div>),
            },
            {
                title: t('tabs.learn'),
                path: "learn",
                component: () => <Suspense fallback={fallback}><Learn /></Suspense>,
            },
            {
                title: t('tabs.members'),
                path: "members",
                component: () => <Suspense fallback={fallback}><OrganizationMembers /></Suspense>,
            },
        ])
        setTitle(t('title'))
    }, [setTabs, setTitle, couchAuthState.couchLoading, organizationID]);
    return <OrganizationProvider organization={organizationID}><AdminLayout /></OrganizationProvider>
}

export default withTranslation('organizations')(Organization);