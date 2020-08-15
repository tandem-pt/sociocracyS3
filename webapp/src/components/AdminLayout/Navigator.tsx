import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import { Omit } from '@material-ui/types';
import { useOrganization, useCouchAuth } from '../../contexts';
import { useHistory } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';

export type ActionItemType = {
    id: string,
    icon: React.ReactElement,
    active?: boolean,
    onClick?: () => void
};

export type CategoryType = {
    id: string,
    children: Array<ActionItemType>
};

const categories: Array<CategoryType> = [
    {
        id: 'Develop',
        children: [
            { id: 'Authentication', icon: <PeopleIcon />, active: true },
            { id: 'Database', icon: <DnsRoundedIcon /> },
            { id: 'Storage', icon: <PermMediaOutlinedIcon /> },
            { id: 'Hosting', icon: <PublicIcon /> },
            { id: 'Functions', icon: <SettingsEthernetIcon /> },
            { id: 'ML Kit', icon: <SettingsInputComponentIcon /> },
        ],
    },
    {
        id: 'Quality',
        children: [
            { id: 'Analytics', icon: <SettingsIcon /> },
            { id: 'Performance', icon: <TimerIcon /> },
            { id: 'Test Lab', icon: <PhonelinkSetupIcon /> },
        ],
    },
    {
        id: 'hello', children: [
            { id: 'Logout', icon: <ExitToAppIcon />, onClick: () => { window.location.href = "/logout" } },
        ]
    },
];

const styles = (theme: Theme) =>
    createStyles({
        categoryHeader: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        categoryHeaderPrimary: {
            color: theme.palette.common.white,
        },
        item: {
            paddingTop: 1,
            paddingBottom: 1,
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover,&:focus': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
        },
        itemCategory: {
            backgroundColor: '#232f3e',
            boxShadow: '0 -1px 0 #404854 inset',
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        firebase: {
            fontSize: 24,
            color: theme.palette.common.white,
        },
        itemActiveItem: {
            color: '#4fc3f7',
        },
        itemPrimary: {
            fontSize: 'inherit',
        },
        itemIcon: {
            minWidth: 'auto',
            marginRight: theme.spacing(2),
        },
        divider: {
            marginTop: theme.spacing(2),
        },
    });

export interface NavigatorProps extends Omit<DrawerProps, 'classes'>, WithStyles<typeof styles> { }

const Navigator = ({ classes, ...other }: NavigatorProps) => {
    const history = useHistory();
    const { organization } = useOrganization();
    const couchAuthState = useCouchAuth();
    const [organizationID, organizationName] = couchAuthState.couchLoading === true ? [] : couchAuthState.user.organizations.filter(([orgID]) => orgID === organization)[0];
    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
                    Sociocracy S3
                </ListItem>
                {organizationName ?
                    <ListItem
                        className={clsx(classes.item, classes.itemCategory)}
                        button
                        onClick={() => history.push(`/organizations/${organizationID}/about`)}>
                        <ListItemIcon className={classes.itemIcon}>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                            classes={{
                                primary: classes.itemPrimary,
                            }}
                        >
                            {organizationName}
                        </ListItemText>
                    </ListItem> : <Skeleton variant="rect" height={61} />}
                {categories.map(({ id, children }) => (
                    <React.Fragment key={id}>
                        <ListItem className={classes.categoryHeader} >
                            <ListItemText
                                classes={{
                                    primary: classes.categoryHeaderPrimary,
                                }}
                            >
                                {id}
                            </ListItemText>
                        </ListItem>
                        {children.map(({ id: childId, icon, active, onClick = () => { } }) => (
                            <ListItem
                                key={childId}
                                button
                                className={clsx(classes.item, active && classes.itemActiveItem)}
                                onClick={onClick}
                            >
                                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                                <ListItemText
                                    classes={{
                                        primary: classes.itemPrimary,
                                    }}
                                >
                                    {childId}
                                </ListItemText>
                            </ListItem>
                        ))}
                        <Divider className={classes.divider} />
                    </React.Fragment>
                ))}
            </List>
        </Drawer>
    );
}

export default withStyles(styles)(Navigator);
