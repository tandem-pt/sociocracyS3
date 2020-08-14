import React, { useMemo } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { useLocation, Link } from 'react-router-dom';
import { NavigationTabList } from './NavigationTab.types'

const styles = () =>
    createStyles({
        secondaryBar: {
            zIndex: 0,
        },
    });


export type TabsHeaderProps = NavigationTabList & WithStyles<typeof styles>

const TabsHeader = ({ classes, tabs }: TabsHeaderProps) => {
    const location = useLocation();
    const pathname = useMemo(() => {
        const matches = location.pathname.split('/');
        return matches[matches.length - 1];
    }, [location.pathname])
    return (
        <AppBar
            component="div"
            className={classes.secondaryBar}
            color="primary"
            position="static"
            elevation={0}
        >
            <Tabs value={pathname || tabs[0]?.path} textColor="inherit">
                {tabs.map(({ title, ariaLabel, path }) => <Tab textColor="inherit" aria-label={ariaLabel} label={title} value={path} component={Link} to={path} key={path} />)}
            </Tabs>
        </AppBar>
    );
}

export default withStyles(styles)(TabsHeader);
