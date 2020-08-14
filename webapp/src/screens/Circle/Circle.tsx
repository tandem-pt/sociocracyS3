import React, { useMemo, Suspense } from 'react';
import AdminLayout, { NavigationTab } from '../../components/AdminLayout'
import { OnBoard } from '../../components'
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from 'react-router-dom';
import { Organization } from '../../contexts';
const Circle = () => {
    const { organization_id: organizationID } = useParams();
    const tabs = useMemo<Array<NavigationTab>>(() => [
        {
            title: "About",
            path: "about",
            component: () => (<div>About</div>),
        },
        {
            title: "Onboard",
            path: "onboard",
            component: () => <Suspense fallback={<CircularProgress size={20} />}><OnBoard /></Suspense>,
        },
        {
            title: "Operations",
            path: "operations",
            component: () => <div>Operations</div>,
        },
        {
            title: "Members",
            path: "members",
            component: () => <div>Members</div>,
        },
    ], []);
    return <Organization organization={organizationID}><AdminLayout tabs={tabs} /></Organization>
}


export default Circle;