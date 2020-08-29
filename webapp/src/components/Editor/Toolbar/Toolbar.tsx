import React, { Ref, PropsWithChildren, useEffect } from 'react'
import { makeStyles, Theme } from "@material-ui/core";
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { BaseProps } from './types';
import Menu from './Menu';

export type ToolbarType = {
    onToolbarStick?: (isSticky: boolean) => void,
};
const Toolbar = React.forwardRef(
    (
        { onToolbarStick, className, ...props }: PropsWithChildren<BaseProps & ToolbarType>,
        ref: Ref<HTMLDivElement>
    ) => {
        const trigger = useScrollTrigger({
            target: undefined,
            disableHysteresis: true,
            threshold: 48 * 2 + 24,
        });
        useEffect(() => {
            if (onToolbarStick) {
                onToolbarStick(trigger);
            }
        }, [trigger, onToolbarStick])
        const classes = useStyles();
        return <div className={classes.toolbarContainer}><Menu
            {...props}
            ref={ref}
            className={(className ? `${className} ` : '') + classes.toolbar + (trigger ? ` ${classes.toolbar_sticky}` : '')}
        /></div>
    }
)


const useStyles = makeStyles((theme: Theme) => ({
    toolbarContainer: {
        position: 'relative',
        height: 48
    },
    toolbar: {
        position: 'absolute',
        top: 0,
        width: '100%',
        maxWidth: '900px',

        padding: '1px 18px 4px',
        margin: '0',
        marginLeft: '-20px',
        marginBottom: 8,
    },
    toolbar_sticky: {
        position: 'fixed',
        top: 48,
        background: theme.palette.background.paper,
        paddingTop: 8
    }
}));

export default Toolbar;