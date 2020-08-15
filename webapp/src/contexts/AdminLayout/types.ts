import React from 'react';

export type AdminLayoutType = {
  setTabs: (tabs: NavigationTab[]) => void;
  tabs: NavigationTab[];
  title: string;
  setTitle: (title: string) => void;
};

export type NavigationTab = {
  title: string;
  ariaLabel?: string;
  path: string;
  component: React.FunctionComponent;
};
