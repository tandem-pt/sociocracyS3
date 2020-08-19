import React, { useEffect, useState } from 'react';
import { Theme, withStyles, WithStyles, createStyles, CardHeader, Card, CardContent, Typography, Input, CardActionArea, Button } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Loading } from '../../screens';
import { PlainLayout, Markdown, PrimaryButton } from '../../components';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { searchParams } from './searchParams';
import Skeleton from '@material-ui/lab/Skeleton';
import { useAuth0 } from '@auth0/auth0-react';
import NotFound from './NotFound';
import { useCouchAuth } from '../../contexts';
export type JoinProps = WithStyles<typeof styles> & WithTranslation;
export type JoinParams = {
    invitation_id: string[],
    token: string[]
}
export type InvitationModel = {
    invitation_id: number,
    organization_name: string,
    organization_id: string,
    accepted_at: null | string,
    email: string
}

const Join = ({ classes, t, i18n }: JoinProps) => {
    const params = searchParams(useLocation()) as JoinParams;
    const { getIdTokenClaims } = useAuth0();
    const couchAuthState = useCouchAuth();
    const [token] = params.token;
    const [invitation_id] = params.invitation_id;
    const [organization, setOrganization] = useState<InvitationModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    useEffect(() => {
        const getInfos = async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + "/api/v1/members/" + invitation_id + '?token=' + token, {
                credentials: "include"
            });
            if (response.ok) {
                const infos = (await response.json()) as InvitationModel;
                setOrganization(infos);
            } else if (response.status === 404) {
                setIsNotFound(true);
            }
        }
        getInfos().then(() => setIsLoading(false));
    }, [setIsLoading, setOrganization]);
    if (organization && organization.accepted_at && organization.organization_id) {
        return <Redirect to={`/organizations/${organization.organization_id}`} />
    }
    if (isLoading) {
        return <Loading />;
    }
    if (isNotFound)
        return <NotFound />

    return <PlainLayout>
        <Card raised>
            <CardHeader
                title={isLoading || organization === null
                    ? <Skeleton variant="text" />
                    : t('join.title', { name: organization.organization_name })}
            />
            <CardContent className={classes.content}>
                <Markdown filename="join-organization" lang={i18n.language} />
            </CardContent>
            <CardActionArea className={classes.actions}
                component={PrimaryButton}
                size="large"
                onClick={async () => {
                    const { __raw: idToken } = await getIdTokenClaims();
                    const response = await fetch(process.env.REACT_APP_API_URL + "/api/v1/members/" + invitation_id, {
                        method: 'PUT',
                        body: JSON.stringify({
                            token,
                            accepted_at: (new Date().toISOString())
                        }),
                        headers: {
                            'Authorization': 'Bearer ' + idToken,
                            'Content-Type': 'application/json'
                        },
                        credentials: "include"

                    });
                    if (response.ok) {
                        const infos = (await response.json()) as InvitationModel;
                        couchAuthState.couchLoading === false && await couchAuthState.getCouchToken();
                        setOrganization(infos);
                    }
                }} contained>
                <Typography variant="body1">{t('join.participate')}</Typography>
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

export default withTranslation('welcome')(withStyles(styles)(Join));