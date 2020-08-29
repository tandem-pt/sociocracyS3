import React, {useContext} from 'react';
import {AdminLayoutType} from './types';

const AdminLayoutContext = React.createContext<AdminLayoutType>({
  tabs: [],
  title: 'Sociocracy S3',
  navigationTitle: '',
  setTabs: x => undefined,
  setTitle: x => undefined,
  setNavigationTitle: x => undefined,
});

AdminLayoutContext.displayName = 'AdminLayoutContext';

export const useAdminLayout = () =>
  useContext<AdminLayoutType>(AdminLayoutContext);

export default AdminLayoutContext;
