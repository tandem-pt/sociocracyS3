import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import theme from '../../theme'
export type LoadingProps = { children: React.ReactNode } & WithStyles<typeof styles>;
const Loading = ({ classes, children }: LoadingProps) => {
    return (
        <div className={classes.root}>
            <CircularProgress size={40} />
            <div className={classes.message}><Typography variant="body1" >{children}</Typography></div>
        </div>
    );
};

const styles = createStyles({
    root: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    message: {
        marginTop: theme.spacing(4)
    }
});

export default withStyles(styles)(Loading);
