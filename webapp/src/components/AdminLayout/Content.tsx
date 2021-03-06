import React, { useMemo } from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { NavigationTabList } from './NavigationTab.types';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import { compile } from 'path-to-regexp';


export type ContentProps = {} & WithStyles<typeof styles> & NavigationTabList;

function Content({ classes, tabs }: ContentProps) {
    const match = useRouteMatch();
    const pathMatch = useMemo<string>(() => {
        const pathMatcher = compile(match.path);
        return pathMatcher(match.params);
    }, [match.path, match.params]);
    return (
        <div className={classes.root}>
            <Switch>
                {tabs.length > 0 && <Redirect from={pathMatch} to={`${pathMatch}${tabs[0].path}`} exact />}
                {tabs.map(({ path, component }) => <Route path={`${pathMatch}${path}`} component={component} key={path} exact />)}
            </Switch>
        </div>

    );
}
const styles = () =>
    createStyles({
        root: { zIndex: 1 }
    });
export default withStyles(styles)(Content);
