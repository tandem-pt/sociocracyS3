import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from '@material-ui/core/CardActionArea';
import { PrimaryButton } from '../../components';
import {
    useHistory,
} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { withTranslation, WithTranslation } from 'react-i18next';

export type WelcomeProps = WithStyles<typeof styles> & WithTranslation;

const Welcome = ({ classes, t }: WelcomeProps) => {
    const history = useHistory();
    return (
        <div className={classes.root}>
            <Card >
                <CardHeader title={t('title')} />
                <CardContent >
                    <Typography>{t('content')}</Typography>
                </CardContent>
                <CardActionArea className={classes.actions}
                    component={PrimaryButton}
                    size="large"
                    onClick={() => {
                        history.push("/login")
                    }} contained>
                    {t('submitBtn')}
                </CardActionArea>
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
        textAlign: "center",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    }
});

export default withTranslation('welcome')(withStyles(styles)(Welcome));
