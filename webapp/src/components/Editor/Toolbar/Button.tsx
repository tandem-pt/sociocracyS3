import React, { Ref, PropsWithChildren } from 'react'
import { makeStyles, Theme } from "@material-ui/core";
import { BaseProps } from './types';


const useStyles = makeStyles((theme: Theme) => ({
    button: (props: any) => {
        return {
            cursor: 'pointer',
            opacity: props.disabled ? 0.3 : 1,
            color: props.reversed
                ? props.active
                    ? theme.palette.common.white
                    : theme.palette.grey.A200
                : props.active
                    ? theme.palette.common.black
                    : theme.palette.grey[500]
        }
    }
}));

const Button = React.forwardRef(
    (
        {
            className,
            active,
            reversed,
            disabled,
            onMouseDown,
            ...props
        }: PropsWithChildren<
            {
                active: boolean
                reversed: boolean
                disabled: boolean,
                onMouseDown: ((event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void) | undefined
            } & BaseProps
        >,
        ref: Ref<HTMLSpanElement>
    ) => {
        const classes = useStyles({ active, reversed, disabled })
        return <span
            {...props}
            onMouseDown={disabled ? undefined : onMouseDown}
            ref={ref}
            className={(className ? `${className} ` : '') + classes.button}
        />
    }
)

export default Button;