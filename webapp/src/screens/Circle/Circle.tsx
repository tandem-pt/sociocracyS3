import React, { useMemo } from 'react';
import AdminLayout, { NavigationTab } from '../../components/AdminLayout'
const Circle = () => {
    const tabs = useMemo<Array<NavigationTab>>(() => {
        return [{
            title: 'About',
            path: '',
            component: () => <div>About</div>
        },
        {
            title: 'Onboard',
            path: 'onboard',
            component: () => <div>Onboard</div>
        }, {
            title: 'Operations',
            path: 'operations',
            component: () => <div>Operations</div>
        }, {
            title: 'Members',
            path: 'members',
            component: () => <div>Members</div>
        },
        ];
    }, []);

    return <AdminLayout tabs={tabs}></AdminLayout>
}

export default Circle;