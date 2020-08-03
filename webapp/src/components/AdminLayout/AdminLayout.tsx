import React from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
    Theme
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Navigator from './Navigator';
import Content from './Content';
import Header from './Header';
import { NavigationTabList } from './NavigationTab.types'
import Copyright from '../Copyright'

export type AdminLayoutProps = WithStyles<typeof styles> & NavigationTabList;

const AdminLayout = ({ classes, tabs }: AdminLayoutProps) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <nav className={classes.drawer}>
                <Hidden smUp implementation="js">
                    <Navigator
                        PaperProps={{ style: { width: drawerWidth } }}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                    />
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Navigator PaperProps={{ style: { width: drawerWidth } }} />
                </Hidden>
            </nav>
            <div className={classes.app}>
                <Header onDrawerToggle={handleDrawerToggle} tabs={tabs} />
                <main className={classes.main}>
                    <Content tabs={tabs} />
                </main>
                <footer className={classes.footer}>
                    <Copyright />
                </footer>
            </div>
        </div>
    );
}


const drawerWidth = 256;

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        minHeight: '100vh',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    app: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        flex: 1,
        padding: theme.spacing(6, 4),
        background: '#eaeff1',
    },
    footer: {
        padding: theme.spacing(2),
        background: '#eaeff1',
    },
});


export default withStyles(styles)(AdminLayout);
