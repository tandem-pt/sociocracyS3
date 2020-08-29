import React, { Ref, PropsWithChildren } from 'react'
import { makeStyles, Theme } from "@material-ui/core";
import { BaseProps } from './types';


const Menu = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<HTMLDivElement>
    ) => {
        const classes = useStyles();
        return <div
            {...props}
            ref={ref}
            className={(className ? `${className} ` : '') + classes.menu}
        />
    }
)

const useStyles = makeStyles((theme: Theme) => ({
    menu: {
        '& > *': {
            display: 'inline-block'
        },
        '& > * + *': {
            marginLeft: '15px',
        }
    }
}));

export default Menu;