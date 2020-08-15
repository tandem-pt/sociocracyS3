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
import { TFunction } from 'i18next'
import { withTranslation, WithTranslation } from 'react-i18next';

export type WelcomeProps = WithStyles<typeof styles> & WithTranslation;

const Welcome = ({ classes, t }: WelcomeProps) => {
    return (
        <div className={classes.root}>
            <Card >
                <CardHeader title={t('title')} />
                <CardContent >
                    <Typography>{t('content')}</Typography>
                </CardContent>
                <CardActions className={classes.actions}>
                    <Link component={({ navigate, ...props }) => <PrimaryButton contained {...props} />} to="/login" >{t('submit_btn')}</Link>
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
    },
    actions: {
        justifyContent: "flex-end",

    }
});

export default withTranslation('welcome')(withStyles(styles)(Welcome));
