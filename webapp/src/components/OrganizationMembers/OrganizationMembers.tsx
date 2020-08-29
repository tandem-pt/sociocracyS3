import React, { PropsWithChildren, useState, useEffect, useCallback } from 'react';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WithTranslation, withTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import NewMember from './NewMember';
import { useAuth0 } from "@auth0/auth0-react";
import { List, ListItem, ListItemText, ListItemSecondaryAction, Chip, Typography, Grid } from '@material-ui/core';
import { useOrganization, useCouchAuth } from '../../contexts';
import moment from 'moment';
import { PrimaryButton } from '../Button';

export type OrganizationMembersType = WithStyles<typeof styles> & WithTranslation & PropsWithChildren<{}>;
export type MemberModel = {
    id: number,
    email: string,
    user_id: string,
    accepted_at: string,
    created_at: string
};

const OrganizationMembers = ({ classes, t }: OrganizationMembersType) => {
    const [formIsDisplayed, setFormIsDisplayed] = useState<boolean>(false);
    const { selectedOrganization } = useOrganization();
    const { getIdTokenClaims } = useAuth0();
    const couchAuthState = useCouchAuth();
    const [members, setMembers] = useState<MemberModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        const { __raw: idToken } = await getIdTokenClaims();
        const response = await fetch(process.env.REACT_APP_API_URL + "/api/v1/members?organization=" + selectedOrganization.id, {
            headers: {
                'Authorization': 'Bearer ' + idToken,
            },
            credentials: "include"
        });
        if (response.ok) {
            const members = await response.json();
            setMembers(members);
        }
        setIsLoading(false);
    }, [setIsLoading, setMembers, getIdTokenClaims, selectedOrganization])
    useEffect(() => {
        let timeout: null | NodeJS.Timeout = null;
        const queueFetchMember = () => {
            if (timeout) clearTimeout(timeout);
            if (!formIsDisplayed)
                fetchMembers();
            timeout = setTimeout(queueFetchMember, 10000);
        }
        queueFetchMember();
        return () => { timeout && clearTimeout(timeout); }
    }, [fetchMembers, formIsDisplayed]);
    return <>
        <div className={classes.root}>
            <Grid container alignItems="flex-end" className={classes.header}>
                <Grid item xs={12} md={8} >
                    <Typography variant="h3">
                        {t('members.list.title')}
                        {isLoading && <CircularProgress size={20} className={classes.loader} />}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4} className={classes.actions}>
                    <PrimaryButton startIcon={<AddIcon />} variant="contained" onClick={() => setFormIsDisplayed(true)}>{t('members.list.add_new')}</PrimaryButton>
                </Grid>
            </Grid>
            <List>
                {members.map((member) => {
                    const isMe = couchAuthState.couchLoading === false && couchAuthState.user.sub === member.user_id;
                    let secondaryText;
                    if (isMe) {
                        secondaryText = t('members.list.me');
                    } else {
                        if (member.accepted_at) {
                            secondaryText = t('members.list.accepted_at', { when: moment(member.accepted_at).fromNow() });
                        } else if (member.created_at) {
                            secondaryText = t('members.list.invited_at', { when: moment(member.created_at).fromNow() });
                        }
                    }
                    return <ListItem key={member.id} dense divider>
                        <ListItemText
                            primary={member.email}
                            secondary={secondaryText} />
                        <ListItemSecondaryAction>
                            {member.accepted_at && <Chip label={t('members.list.accepted_chip')} color="primary" variant="outlined" />}
                            {!member.accepted_at && member.created_at && <Chip label={t('members.list.invited_chip')} variant="outlined" />}

                        </ListItemSecondaryAction>
                    </ListItem>
                })}

            </List>


        </div>
        <NewMember open={formIsDisplayed} id="InviteNewMembers" onClose={() => {
            setFormIsDisplayed(false)
            fetchMembers();
        }} className={classes.dialog} />
    </>

}

const styles = (theme: Theme) => createStyles({
    root: {
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        paddingTop: theme.spacing(2)
    },
    header: {
        marginBottom: theme.spacing(4)
    },
    loader: {
        marginLeft: theme.spacing(1)
    },
    dialog: {
        width: '100vw'
    },
    actions: {
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(1)
        },
        [theme.breakpoints.up('md')]: {
            textAlign: 'right'
        }
    },
    listCard: {
        margin: theme.spacing(0, 1)
    },
    input: {
        padding: theme.spacing(1),
        minHeight: theme.typography.fontSize * 15,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(4),
        maxWidth: '60rem'
    },
    footer: {
        position: 'absolute',
        bottom: theme.spacing(2),
        left: 0,
        right: 0
    }
});

export default withTranslation('organizations')(withStyles(styles)(OrganizationMembers));
