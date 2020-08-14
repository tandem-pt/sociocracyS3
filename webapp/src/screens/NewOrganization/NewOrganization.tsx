import React, { useState, useCallback } from 'react';

import { PlainLayout, PrimaryButton } from '../../components';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import CardActions from '@material-ui/core/CardActions';
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

export type NewOrganizationProps = WithStyles<typeof styles>;

const NewOrganization = ({ classes }: NewOrganizationProps) => {
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
                await
                    history.push(`/organizations/${organizationID}`);
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
                    title="New Organisation"
                />

                <CardMedia className={classes.media} image={Logo} />

                <CardContent>
                    <Typography variant="body1" id="NewOrganizationTips" gutterBottom>
                        Pick a name for your organisation
                                </Typography>
                    <Input type="text" name="name" id="NewOrganizationName" autoFocus={true} className={classes.input} onChange={({ target: { value } }) => {
                        setOrganizationName(value);
                    }} />
                </CardContent>
                <CardActions className={classes.actions}>
                    <PrimaryButton type="submit" size="large" centerRipple disabled={organizationName.length < 1}>CREATE{isLoading && <CircularProgress size={12} color="primary" className={classes.loading} />}</PrimaryButton>
                </CardActions>
            </Card>

            {couchAuthState.couchLoading === false
                && couchAuthState.user.organizations.length > 0
                && <List className={classes.organizations} component="nav">
                    <ListSubheader>
                        access the organisations you've already create
                     </ListSubheader>
                    {couchAuthState.user.organizations.map(organization => <ListItem button key={organization} href={`/organizations/${organization}`}>{organization}</ListItem>)}
                </List>}
        </form>
    </PlainLayout >
};

const styles = (theme: Theme) => createStyles({
    card: {
    },
    input: {
        width: '100%'
    },
    actions: {
        marginTop: theme.spacing(2),
    },
    media: {
        marginBottom: theme.spacing(2),
        height: '160px',
        backgroundSize: 'contain'
    },
    loading: {
        marginLeft: theme.spacing(1)
    },
    organizations: {
        marginTop: theme.spacing(6),
    }
});

export default withStyles(styles)(NewOrganization);
