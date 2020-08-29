import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
const Title = React.forwardRef(({ children, variant, ...attributes }: React.PropsWithChildren<any> & { variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }, ref) => {
    const classes = useStyles({ variant });

    return <Typography ref={ref} className={classes.title} variant={variant} {...attributes}>{children}</Typography>
})


const useStyles = makeStyles((theme: Theme) => ({
    title: ({ variant = 'h1' }: any) => ({
        marginTop: theme.spacing(1),
        marginBottom: (variant === 'h1' ? theme.spacing(4) : theme.spacing(2)),
        fontSize: (variant === 'h1' ? '5rem' : '3rem'),
        fontWeight: (variant === 'h1' ? 'bold' : 'normal')
    })
}));

export default Title;