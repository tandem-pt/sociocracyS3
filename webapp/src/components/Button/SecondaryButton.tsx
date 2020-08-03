import React from 'react';
import Button, { ButtonProps } from './Button';

const SecondaryButton = (props: ButtonProps) => {
    return <Button color="secondary" {...props} />
}
export default SecondaryButton;