import React from 'react';
import Button, { ButtonProps } from './Button';

const PrimaryButton = (props: ButtonProps) => {
    return <Button color="primary" {...props} />
}
export default PrimaryButton;