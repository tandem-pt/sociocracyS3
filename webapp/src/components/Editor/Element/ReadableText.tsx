import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core'

const ReadableText = React.forwardRef(({ variant = "", className, children, ...props }: any, ref) => {
    const classes = useStyles();
    return <Typography {...props} ref={ref} className={classes.readable + (className ? ` ${className}` : '')}>{children}</Typography>
})

const useStyles = makeStyles((theme: Theme) => ({
    readable: {
        ...theme.typography.body1,
        fontSize: 18,
        lineHeight: 1.68,
        letterSpacing: '0.13px',
    },
}))
export default ReadableText;