import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from '@material-ui/core/CardActions';
import { PrimaryButton } from '../../components';
import {
    Link,
} from "react-router-dom";
import Typography from "@material-ui/core/Typography";

export interface WelcomeProps extends WithStyles<typeof styles> { }
const Welcome = ({ classes }: WelcomeProps) => {
    return (
        <div className={classes.root}>
            <Card >
                <CardHeader title="Welcome" />
                <CardContent >
                    <Typography>Hello</Typography>
                </CardContent>
                <CardActions>
                    <Link component={({ navigate, ...props }) => <PrimaryButton contained {...props} />} to="/login" >Login</Link>
                </CardActions>
            </Card>
        </div>
    );
};

const styles = createStyles({
    root: {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default withStyles(styles)(Welcome);
