import React from 'react';
export type NavigationTab = {
    title: string,
    ariaLabel?: string,
    path: string,
    component: React.FunctionComponent
}

export type NavigationTabList = { tabs: Array<NavigationTab> };
