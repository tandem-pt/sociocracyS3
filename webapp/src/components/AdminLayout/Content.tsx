import React, { useMemo } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { NavigationTabList } from './NavigationTab.types';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const styles = (theme: Theme) =>
    createStyles({
        root: { zIndex: 1 }
    });

export type ContentProps = {} & WithStyles<typeof styles> & NavigationTabList;

function Content({ classes, tabs }: ContentProps) {
    const [firstRoute] = tabs;
    const match = useRouteMatch();
    const matchPath = useMemo(() => match.path[match.path.length - 1] === '/' ? match.path.substr(0, -1) : match.path, [match.path]);
    return (
        <div className={classes.root}>
            <Switch>
                {tabs.map(({ path, component }) => <Route path={`${matchPath}/${path}`} component={component} key={path} exact />)}
                {firstRoute && <Route path={matchPath} component={firstRoute.component} key={firstRoute.path} exact />}
            </Switch>
        </div>

    );
}

export default withStyles(styles)(Content);
