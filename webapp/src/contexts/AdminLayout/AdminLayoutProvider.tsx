import React, { useState } from 'react';
import AdminLayoutContext from './AdminLayoutContext'
import { NavigationTab } from './types';
export type AdminLayoutProps = React.PropsWithChildren<{
}>
const AdminLayoutProvider = ({ children }: AdminLayoutProps) => {
    const [title, setTitle] = useState('');
    const [navigationTitle, setNavigationTitle] = useState('');
    const [tabs, setTabs] = useState<NavigationTab[]>([]);

    return <AdminLayoutContext.Provider value={{ setTitle, title, tabs, setTabs, navigationTitle, setNavigationTitle }} >
        {children}
    </AdminLayoutContext.Provider >
}

export default AdminLayoutProvider;