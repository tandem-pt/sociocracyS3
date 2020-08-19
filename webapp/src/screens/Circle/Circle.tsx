import React, { Suspense, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout'
import { OnBoard } from '../../components'
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from 'react-router-dom';
import { Organization, useAdminLayout } from '../../contexts';
import { withTranslation, WithTranslation } from 'react-i18next';
type CircleType = WithTranslation;
const Circle = ({ t }: CircleType) => {
    const { organization_id: organizationID } = useParams();
    const { setTabs, setTitle } = useAdminLayout();
    useEffect(() => {
        setTabs([
            {
                title: "About",
                path: t('tabs.about'),
                component: () => (<div>About</div>),
            },
            {
                title: "Onboard",
                path: t('tabs.onboard'),
                component: () => <Suspense fallback={<CircularProgress size={20} />}><OnBoard /></Suspense>,
            },
            {
                title: "Operations",
                path: "tabs.operations",
                component: () => <div>Operations</div>,
            },
            {
                title: "Members",
                path: "tabs.members",
                component: () => <div>Members</div>,
            },
        ]);
        setTitle(t('title'));
    }, [setTabs, setTitle, t]);
    return <Organization organization={organizationID}><AdminLayout /></Organization>
}

export default withTranslation('circles')(Circle);