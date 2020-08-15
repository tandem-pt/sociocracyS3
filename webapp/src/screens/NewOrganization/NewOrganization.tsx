import React, { useState, useCallback } from 'react';

import { PlainLayout, PrimaryButton } from '../../components';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Theme, createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import CardMedia from '@material-ui/core/CardMedia';
import Logo from './mediumres-logo.png'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useAuth0 } from "@auth0/auth0-react";
import { useCouchAuth } from '../../contexts';
import { useHistory } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import { withTranslation, WithTranslation } from 'react-i18next';

export type NewOrganizationProps = WithStyles<typeof styles> & WithTranslation;

const NewOrganization = ({ classes, t }: NewOrganizationProps) => {
    const [organizationName, setOrganizationName] = useState<string>("");
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { getIdTokenClaims } = useAuth0();
    const couchAuthState = useCouchAuth();
    const onSubmit = useCallback(async (evt) => {
        if (evt.preventDefault) evt.preventDefault();
        setIsLoading(true);
        const { __raw: idToken } = await getIdTokenClaims();
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "/api/v1/organizations", {
                method: 'POST',
                body: JSON.stringify({ name: organizationName }),
                headers: {
                    'Authorization': 'Bearer ' + idToken,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const { id: organizationID } = await response.json();
                if (couchAuthState.couchLoading === false) {
                    await couchAuthState.getCouchToken()
                }
                history.push(`/organizations/${organizationID}/members`);
                return;
            }
            throw new Error('Error while fetching ' + response.status);
        } catch (err) {
            console.error(err)
        }
        setIsLoading(false);

        return false;
    }, [organizationName, history, getIdTokenClaims])

    return <PlainLayout>
        <form id="NewOrganization" aria-labelledby="NewOrganizationTips" aria-busy={isLoading} onSubmit={onSubmit}>
            <Card raised>
                <CardHeader
                    title={t('new.title')}
                />

                <CardMedia className={classes.media} image={Logo} />

                <CardContent>
                    <Typography variant="body1" id="NewOrganizationTips" gutterBottom>
                        {t('new.fields.name.label')}
                    </Typography>
                    <Input aria-label={t('new.fields.name.tips')} type="text" name="name" id="NewOrganizationName" autoFocus={true} className={classes.input} onChange={({ target: { value } }) => {
                        setOrganizationName(value);
                    }} />
                </CardContent>
                <CardActionArea
                    component={Button}
                    className={classes.actions}
                    color="primary"
                    variant="contained"
                    size="large"
                    disabled={organizationName.length < 1}
                    type="submit"
                >
                    <span>{t('new.submit_btn')} {isLoading && <CircularProgress size={12} color="secondary" className={classes.loading} />}</span>
                </CardActionArea>
            </Card>

        </form>
        {couchAuthState.couchLoading === false
            && couchAuthState.user.organizations.length > 0
            && <List className={classes.organizations} dense component="nav">
                <ListSubheader>
                    {t('new.organizations')}
                </ListSubheader>
                {couchAuthState.user.organizations.map(([organizationID, organizationName]) => <ListItem button key={organizationID} onClick={() => history.push(`/organizations/${organizationID}`)}>{organizationName}</ListItem>)}
            </List>}
        {couchAuthState.couchLoading === true && <Skeleton className={classes.organizations} style={{ opacity: 0.3 }} animation="pulse" variant="rect" width={320} height={120} />}
    </PlainLayout >
};

const styles = (theme: Theme) => createStyles({
    card: {
    },
    input: {
        width: '100%'
    },
    loading: {
        marginLeft: theme.spacing(1)
    },
    actions: {
        marginTop: theme.spacing(2),
        textAlign: 'center',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
    },
    media: {
        marginBottom: theme.spacing(2),
        height: '160px',
        backgroundSize: 'contain'
    },

    organizations: {
        marginTop: theme.spacing(6),
    }
});
export default withTranslation('organizations')(withStyles(styles)(NewOrganization));