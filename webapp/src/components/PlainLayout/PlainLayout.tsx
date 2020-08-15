import React, { PropsWithChildren } from "react";
import { Theme, createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Copyright } from '..';
export type PlainLayoutProps = PropsWithChildren<{

}> & WithStyles<typeof styles>;

const PlainLayout = ({ classes, children }: PlainLayoutProps) => (
    <div className={classes.root}>
        {children}
        <div className={classes.footer}>
            <Copyright />
        </div>
    </div>
)
const styles = (theme: Theme) => createStyles({
    root: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: theme.spacing(12)
    },
    footer: {
        position: 'absolute',
        bottom: theme.spacing(2),
        left: 0,
        right: 0
    }
});

export default withStyles(styles)(PlainLayout);
