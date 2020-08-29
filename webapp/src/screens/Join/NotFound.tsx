import React from 'react';
import { Theme, withStyles, WithStyles, createStyles, CardHeader, Card, CardContent, Typography, CardActionArea } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlainLayout, SecondaryButton } from '../../components';
export type NotFoundProps = WithStyles<typeof styles> & WithTranslation;

const NotFound = ({ classes, t, i18n }: NotFoundProps) => {
    return <PlainLayout>
        <Card raised>
            <CardHeader
                title={t('join.404.title')}
            />
            <CardContent className={classes.content}>
                <Typography variant="body1">{t('join.404.content')}</Typography>
            </CardContent>
            <CardActionArea className={classes.actions}
                component={SecondaryButton}
                size="large"
                href="/" contained>
                <Typography variant="body1">{t('join.404.return')}</Typography>
            </CardActionArea>

        </Card>
    </PlainLayout >
}

const styles = (theme: Theme) => createStyles({
    actions: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        textAlign: "center"
    },
    content: {
        maxWidth: '50rem'
    }
});

export default withTranslation('welcome')(withStyles(styles)(NotFound));