import React, {useContext} from 'react';

export type OrganizationContextType = {
  organization: string;
};

const OrganizationContext = React.createContext<OrganizationContextType>({
  organization: '',
});
OrganizationContext.displayName = 'OrganizationContext';

export const useOrganization = () =>
  useContext<OrganizationContextType>(OrganizationContext);

export default OrganizationContext;
