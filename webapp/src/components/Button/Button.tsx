import React from 'react';
import MUIButton,
{ ButtonProps as MUIButtonProps } from '@material-ui/core/Button';

export interface ButtonProps extends MUIButtonProps {
    contained?: boolean
}
const Button = ({ contained = false, ...props }: ButtonProps) => {
    if (contained) props.variant = 'contained';
    return <MUIButton {...props} />
}
export default Button;