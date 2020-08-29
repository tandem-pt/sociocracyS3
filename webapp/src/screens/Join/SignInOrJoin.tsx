import React, { useEffect, useState } from 'react';
import { Theme, withStyles, WithStyles, createStyles, CardHeader, Card, CardContent, Typography, CardActionArea } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlainLayout, Markdown, PrimaryButton } from '../../components';
import { useLocation, useHistory } from 'react-router-dom';
import { searchParams } from './searchParams';
import Skeleton from '@material-ui/lab/Skeleton';
export type SignInOrJoinProps = WithStyles<typeof styles> & WithTranslation;
export type SignInOrJoinParams = {
    invitation_id: string[],
    token: string[], changeAccount: string[]
}
export type InvitationModel = {
    invitation_id: number,
    organization_name: string,
    organization_id: string,
    accepted_at: null | string,
    email: string
}

const SignInOrJoin = ({ classes, t, i18n }: SignInOrJoinProps) => {
    const params = searchParams(useLocation()) as SignInOrJoinParams;
    const history = useHistory();
    const [token] = params.token;
    const [invitation_id] = params.invitation_id;
    const [changeAccount] = params.changeAccount || [false]
    const [organization, setOrganization] = useState<InvitationModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetched, setIsFetched] = useState(false);
    useEffect(() => {
        if (changeAccount) {
            history.push({
                pathname: "/login",
                state: {
                    returnTo: `/participate`,
                    search: `invitation_id=${invitation_id}&token=${token}`
                }
            })
        }
    }, [changeAccount, history, invitation_id, token])
    useEffect(() => {
        const getInfos = async () => {
            if (isLoading || isFetched) return;
            setIsLoading(true);
            const response = await fetch(process.env.REACT_APP_API_URL + "/api/v1/members/" + invitation_id + '?token=' + token, {
                credentials: "include"
            });
            if (response.ok) {
                const infos = (await response.json()) as InvitationModel;
                setOrganization(infos);
            }
            setIsLoading(false);
            setIsFetched(true);
        }
        getInfos()
    }, [setIsLoading, setOrganization, isLoading, invitation_id, token, setIsFetched, isFetched]);

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
                onClick={() => {
                    history.push({
                        pathname: "/login",
                        state: {
                            returnTo: `/participate`,
                            search: `invitation_id=${invitation_id}&token=${token}`
                        }
                    })
                }} contained>
                <Typography variant="body1">{t('join.signIn')}</Typography>
                <Typography variant="caption">You need to login or register to participate to this organization</Typography>
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

export default withTranslation('welcome')(withStyles(styles)(SignInOrJoin));