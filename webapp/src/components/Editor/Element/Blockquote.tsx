import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';
const Blockquote = React.forwardRef(({ children, attributes }: React.PropsWithChildren<any>, ref) => {
    const classes = useStyles();
    return <blockquote ref={ref} {...attributes} className={classes.blockquote}>{children}</blockquote>
})

const useStyles = makeStyles((theme: Theme) => ({
    blockquote: {
        ...theme.typography.body1,
        fontSize: 18,
        lineHeight: 1.68,
        letterSpacing: '0.13px',
        borderLeft: `3px solid ${theme.palette.divider}`,
        padding: `0 ${theme.spacing(3)}px`,
        marginBlockStart: 0,
        marginBlockEnd: 0,
        marginInlineStart: 0,
        marginInlineEnd: 0,
    }
}))
export default Blockquote;