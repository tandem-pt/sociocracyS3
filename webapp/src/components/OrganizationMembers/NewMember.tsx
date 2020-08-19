import React, { PropsWithChildren, useState, useCallback } from 'react';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import "react-multi-email/style.css";
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { WithTranslation, withTranslation } from 'react-i18next';
import { PrimaryButton } from '../Button';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useOrganization } from '../../contexts';
import { useAuth0 } from '@auth0/auth0-react';
import "react-multi-email/style.css";
import { FormHelperText } from '@material-ui/core';

export type NewMemberType = WithStyles<typeof styles> & WithTranslation & PropsWithChildren<{ id: string }> & DialogProps;

const NewMember = ({ classes, t, id, onClose, ...dialogProps }: NewMemberType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [newEmails, setNewEmails] = useState<string[]>([]);
    const { organization } = useOrganization();
    const { getIdTokenClaims } = useAuth0();
    const onSubmit = useCallback((evt) => {
        if (evt.preventDefault) evt.preventDefault();
        const sendInvite = async () => {
            const { __raw: idToken } = await getIdTokenClaims();
            const response = await fetch(process.env.REACT_APP_API_URL + "/api/v1/members/bulks", {
                method: 'POST',
                body: JSON.stringify({
                    bulks: newEmails.map((email) => ({
                        command: 'create',
                        email,
                        organization_id: organization
                    }))
                }),
                headers: {
                    'Authorization': 'Bearer ' + idToken,
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });
            if (response.ok) {
                const { docs } = await response.json();
                setNewEmails([]);
                if (onClose)
                    onClose({}, "backdropClick");
            }
        };
        if (newEmails.length === 0) return
        setIsLoading(true);
        sendInvite().then(() => setIsLoading(false))
    }, [newEmails, getIdTokenClaims]);

    return <Dialog className={classes.formCard} aria-labelledby={id} {...dialogProps} onClose={onClose}>
        <form onSubmit={onSubmit}>
            <DialogTitle disableTypography id={id}>
                <Typography variant="h6">{t('members.invite.title')}</Typography>
                {onClose &&
                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => onClose({}, "backdropClick")}>
                        <CloseIcon />
                    </IconButton>}
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                >{t('members.invite.subtitle')}</DialogContentText>
                <InputLabel >
                    {t('members.invite.emailLabel')}
                </InputLabel>
                <ReactMultiEmail
                    className={classes.input}
                    emails={newEmails}
                    onChange={(emails: string[]) => {
                        setNewEmails(emails);
                    }}
                    validateEmail={isEmail}
                    getLabel={(
                        email: string,
                        index: number,
                        removeEmail: (index: number) => void,
                    ) => {
                        return (
                            <div data-tag key={index}>
                                {email}
                                <span data-tag-handle onClick={() => removeEmail(index)} aria-label={t('members.invite.remove')}>
                                    ×
                            </span>
                            </div>
                        );
                    }}
                />
                <FormHelperText>{t('members.invite.helpText')}</FormHelperText>
                <input type="hidden" name="emails" value={newEmails.join(',')} />
            </DialogContent>
            <DialogActions className={classes.actionArea}>
                <PrimaryButton size="large" type="submit" contained disabled={newEmails.length === 0 || isLoading}>
                    {newEmails.length === 0
                        ? t('members.invite.submitBtn_zero')
                        : t('members.invite.submitBtn', { count: newEmails.length })}
                    {isLoading && <CircularProgress size={20} />}
                </PrimaryButton>
            </DialogActions>
        </form>
    </Dialog>

}

const styles = (theme: Theme) => createStyles({
    root: {
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        paddingTop: theme.spacing(2)
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    actionArea: {
        marginTop: theme.spacing(4),
        justifyContent: 'flex-end'
    },
    formCard: {
        maxWidth: '65rem'
    },
    input: {
        padding: theme.spacing(1),
        minHeight: theme.typography.fontSize * 15,
        marginTop: theme.spacing(2),
        maxWidth: '60rem'
    },
    footer: {
        position: 'absolute',
        bottom: theme.spacing(2),
        left: 0,
        right: 0
    }
});

export default withTranslation('organizations')(withStyles(styles)(NewMember));
