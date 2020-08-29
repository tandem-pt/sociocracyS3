import React, {useContext} from 'react';

export type OrganizationType = {
  name: string;
  id: number;
  database: string;
};
export type OrganizationContextType = {
  organizations: OrganizationType[];
  selectedOrganization: OrganizationType;
  setSelectedOrganization: (x: number) => void;
};
const OrganizationContext = React.createContext<OrganizationContextType>({
  organizations: [],
  selectedOrganization: {name: '', id: -1, database: ''},
  setSelectedOrganization: x => x,
});
OrganizationContext.displayName = 'OrganizationContext';

export const useOrganization = () =>
  useContext<OrganizationContextType>(OrganizationContext);

export default OrganizationContext;
