import React from "react";
import { Theme, createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import { useLocation, matchPath } from 'react-router-dom'
import { Copyright } from '../../components'
export type LoadingProps = WithStyles<typeof styles>;
const LoadingCenteredLayout = ({ classes }: LoadingProps) => (
    <div className={`${classes.root} ${classes.root_center}`}>
        <Skeleton animation="wave" variant="rect" className={classes.center} />
        <footer className={`${classes.footer} ${classes.footerCentered}`}>
            <Copyright />
        </footer>
    </div>
)
const LoadingFullLayout = ({ classes }: LoadingProps) => (
    <div className={classes.root}>
        <Skeleton animation="wave" variant="rect" className={classes.navbar} />
        <Skeleton animation="wave" variant="rect" className={classes.header} />
        <Skeleton animation="wave" variant="circle" className={classes.headerNav} />
        <Typography variant="h3" className={classes.headerTitle}>
            <Skeleton animation="wave" variant="text" />
        </Typography>
        <div className={classes.cards}>
            <Skeleton animation="wave" variant="text" />
            <Skeleton animation="wave" variant="text" />
            <Skeleton animation="wave" variant="text" />
        </div>
        <footer className={classes.footer}>
            <Copyright />
        </footer>

    </div >
)
const Loading = (props: LoadingProps) => {
    const location = useLocation();
    const fullLayout = [
        (path: string) => matchPath(path, { path: '/organizations/new', exact: true })
    ];
    return fullLayout.filter((func) => func(location.pathname)).length > 0
        ? <LoadingCenteredLayout {...props} />
        : <LoadingFullLayout {...props} />;
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    root_center: {
        justifyContent: "inherit",
        paddingTop: theme.spacing(12)
    },
    center: {
        width: '20%',
        height: '33rem',
        opacity: 0.8
    },
    navbar: {
        position: 'fixed',
        left: 0,
        width: '256px',
        height: '100vh',
        top: 0,
        bottom: 0,
        opacity: 0.8,
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        }
    },
    header: {
        height: (3 * 48) + 'px',
        position: 'fixed',
        left: '256px',
        [theme.breakpoints.down('xs')]: {
            left: 0,
            width: '100%',
        },
        width: 'calc(100% - 256px)',
        top: 0,
        bottom: 0,
        right: 0,
        opacity: 0.8
    },
    footer: {
        position: 'fixed',
        left: '256px',
        [theme.breakpoints.down('xs')]: {
            left: 0,
            width: '100%',
        },
        width: 'calc(100% - 256px)',
        bottom: 0,
        right: 0,
    },
    footerCentered: {
        width: '100%',
        left: 0,
        bottom: theme.spacing(2)
    },
    headerNav: {
        position: 'fixed',
        top: 10,
        right: 28,
        width: 32,
        height: 32
    },
    headerTitle: {
        position: 'fixed',
        top: 42,
        left: 256 + theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            left: theme.spacing(3)
        },
        width: 69,
    },
    cards: {
        position: 'fixed',
        left: '256px',
        [theme.breakpoints.down('xs')]: {
            left: 0,
            width: '91%'
        },
        top: (3 * 48) + 'px',
        display: 'block',
        marginTop: theme.spacing(6),
        marginLeft: theme.spacing(4),
        width: 'calc(100% - 256px - 9%)'

    },
    card: {
        width: '30%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        height: '160px'
    }
});

export default withStyles(styles)(Loading);
