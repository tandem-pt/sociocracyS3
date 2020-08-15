import React, {useContext} from 'react';
import {AdminLayoutType} from './types';

const AdminLayoutContext = React.createContext<AdminLayoutType>({
  tabs: [],
  title: 'Sociocracy S3',
  setTabs: x => undefined,
  setTitle: x => undefined,
});

AdminLayoutContext.displayName = 'AdminLayoutContext';

export const useAdminLayout = () =>
  useContext<AdminLayoutType>(AdminLayoutContext);

export default AdminLayoutContext;
