import React, { PropsWithChildren, useState, useEffect } from 'react';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WithTranslation, withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import NewMember from './NewMember';
import { useAuth0 } from "@auth0/auth0-react";
import { List, ListItem, ListItemText, ListItemSecondaryAction, Chip } from '@material-ui/core';
import { useOrganization, useCouchAuth } from '../../contexts';
import moment from 'moment';

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
    const { organization } = useOrganization();
    const { getIdTokenClaims } = useAuth0();
    const couchAuthState = useCouchAuth();
    const [members, setMembers] = useState<MemberModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fetchMembers = async () => {
        setIsLoading(true);
        const { __raw: idToken } = await getIdTokenClaims();
        const response = await fetch(process.env.REACT_APP_API_URL + "/api/v1/members?organization=" + organization, {
            headers: {
                'Authorization': 'Bearer ' + idToken,
            },
            credentials: "include"
        });
        if (response.ok) {
            const members = await response.json();
            console.log({ members })
            setMembers(members);
        }
        setIsLoading(false);
    }
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
    }, []);
    return <>
        <div className={classes.root}>
            <Card className={classes.listCard}>
                <CardHeader title={<>{t('members.list.title')}{isLoading && <CircularProgress size={20} className={classes.loader} />}</>} action={<IconButton onClick={() => setFormIsDisplayed(true)}>
                    <AddIcon />
                </IconButton>} />
                <CardContent>
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
                            return <ListItem key={member.id} dense >
                                <ListItemText
                                    primary={member.email}
                                    secondary={secondaryText} />
                                <ListItemSecondaryAction>
                                    {member.accepted_at && <Chip label={t('members.list.accepted_chip')} color="primary" />}
                                    {!member.accepted_at && member.created_at && <Chip label={t('members.list.invited_chip')} />}

                                </ListItemSecondaryAction>
                            </ListItem>
                        })}

                    </List>
                </CardContent>

                <CardActions>

                </CardActions>

            </Card>
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
    loader: {
        marginLeft: theme.spacing(2)
    },
    dialog: {
        width: '100vw'
    },
    actionArea: {
        justifyContent: 'flex-end'
    },
    listCard: {
        maxWidth: '65rem'
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
