import React, { useEffect } from 'react';
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";

export type RedirectorProps = {
    onRedirect: () => void;
} & WithStyles<typeof styles>;

const Redirector = ({ onRedirect, classes }: RedirectorProps) => {
    useEffect(() => {
        const timeout = setTimeout(onRedirect, 1200);
        return () => clearTimeout(timeout);
    }, [onRedirect]);
    return <div className={classes.root}>
        You are being redirected
    </div>
}

const styles = createStyles({
    root: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default withStyles(styles)(Redirector);
