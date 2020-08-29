import React from "react";
import { useSlate } from 'slate-react'
import Button from './Button'
import { isMarkActive, toggleMark, isTitle } from '../utils';

export type MarkButtonProps = {
    format: string,
    icon: JSX.Element,
    title: string
}
const MarkButton = ({ format, icon, title }: MarkButtonProps) => {
    const editor = useSlate()
    return (
        <Button
            active={isMarkActive(editor, format)}
            disabled={isTitle(editor)}
            title={title}
            onMouseDown={(event: any) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}
export default MarkButton;