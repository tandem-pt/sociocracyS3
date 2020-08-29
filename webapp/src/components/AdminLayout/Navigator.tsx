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
import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import { Omit } from '@material-ui/types';
import { useOrganization } from '../../contexts';
import { useHistory } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import { withTranslation, WithTranslation } from 'react-i18next';

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
        id: 'organization',
        children: [
            { id: 'organization', icon: <SettingsIcon />, active: true },
            { id: 'map', icon: <SettingsIcon /> },
        ],
    },
    {
        id: 'shortCuts',
        children: [
            { id: 'Analytics Role', icon: <SettingsIcon /> },
            { id: 'Performance Role', icon: <TimerIcon /> },
            { id: 'Test Lab Role', icon: <PhonelinkSetupIcon /> },
        ],
    },
    {
        id: 'misc', children: [
            { id: 'logout', icon: <ExitToAppIcon />, onClick: () => { window.location.href = "/logout" } },
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

export type NavigatorProps = Omit<DrawerProps, 'classes'> & WithStyles<typeof styles> & WithTranslation;

const Navigator = ({ classes, t, ...other }: NavigatorProps) => {
    const history = useHistory();
    const { selectedOrganization } = useOrganization();
    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
                    Sociocracy S3
                </ListItem>
                {selectedOrganization.name ?
                    <ListItem
                        className={clsx(classes.item, classes.itemCategory)}
                        button
                        onClick={() => history.push(`/${selectedOrganization.id}/about`)}>
                        <ListItemIcon className={classes.itemIcon}>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                            classes={{
                                primary: classes.itemPrimary,
                            }}
                        >
                            {selectedOrganization.name}
                        </ListItemText>
                    </ListItem> : <Skeleton variant="rect" height={61} />}

                <ListItem className={classes.categoryHeader} >
                    <ListItemText
                        classes={{
                            primary: classes.categoryHeaderPrimary,
                        }}
                    >
                        {t(`navbar.yourSpace`)}
                    </ListItemText>
                </ListItem>
                <ListItem
                    button
                    className={classes.item}
                >
                    <ListItemIcon className={classes.itemIcon}>-</ListItemIcon>
                    <ListItemText
                        classes={{
                            primary: classes.itemPrimary,
                        }}
                    >
                        {t(`navbar.inbox`)}
                    </ListItemText>
                </ListItem>
                <ListItem
                    button
                    className={classes.item}
                >
                    <ListItemIcon className={classes.itemIcon}>-</ListItemIcon>
                    <ListItemText
                        classes={{
                            primary: classes.itemPrimary,
                        }}
                    >
                        {t(`navbar.proposals`)}
                    </ListItemText>
                </ListItem>


                {categories.map(({ id, children }, index) => (
                    <React.Fragment key={id}>
                        <ListItem className={classes.categoryHeader} >
                            <ListItemText
                                classes={{
                                    primary: classes.categoryHeaderPrimary,
                                }}
                            >
                                {t(`navbar.${id}`)}
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
                                    {t(`${id}.${childId}`)}
                                </ListItemText>
                            </ListItem>
                        ))}
                        {index < categories.length - 2 && <Divider className={classes.divider} />}
                    </React.Fragment>
                ))}
            </List>
        </Drawer >
    );
}

export default withTranslation('translation')(withStyles(styles)(Navigator));
