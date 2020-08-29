import React from "react";
import { useSlate } from 'slate-react'
import Button from './Button'
import { isBlockActive, toggleBlock, isTitle } from '../utils';

export type BlockButtonProps = {
    format: string,
    icon: JSX.Element,
    title: string
}
const BlockButton = ({ format, icon, title }: BlockButtonProps) => {
    const editor = useSlate()
    return (
        <Button
            title={title}
            disabled={isTitle(editor)}
            active={isBlockActive(editor, format)}
            onMouseDown={(event: any) => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            {icon}
        </Button >
    )
}

export default BlockButton;