// Import React dependencies.
import React, { useMemo, useCallback, useState, useEffect } from "react";
// Import the Slate editor factory.
import { createEditor, Transforms } from 'slate'
import { withHistory } from 'slate-history'
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { makeStyles, Theme } from "@material-ui/core";
import isHotkey from 'is-hotkey'
import { FormatBold, FormatItalic, FormatUnderlined, LooksOne, FormatQuote, FormatListBulleted, FormatListNumbered } from '@material-ui/icons';
import { HOTKEYS } from './constants';
import { withLayout, toggleMark } from './utils';
import Toolbar, { BlockButton, MarkButton } from './Toolbar'
import Element, { Leaf } from './Element'
import { withTranslation, WithTranslation } from "react-i18next";
import { EditListPlugin } from '@productboard/slate-edit-list'


const options = {
    types: ['ol-list', 'ul-list'],
    typeItem: ['list-item'],
    typeDefault: 'paragraph'
} // additional options

const [
    withEditList,
    editListEventHandler,
] = EditListPlugin(options);

export type EditorProps = {
    value: any[],
    className?: string,
    remoteValue: any[],
    setValue: (v: any[]) => void,
    name: string,
    placeholder?: string,
    normalizeNodes?: (editor: ReactEditor, path: any) => void,
    readOnly?: boolean,
    onToolbarStick?: (isStick: boolean) => void
} & WithTranslation
const Editor = ({ t, onToolbarStick, value, className = '', setValue: _setValue, remoteValue, readOnly = false, placeholder = '', normalizeNodes = (x) => x }: EditorProps) => {
    const [isStale, setIsStale] = useState<boolean>(true)
    const setValue = (value: any[]) => {
        setIsStale(JSON.stringify(value) === JSON.stringify(remoteValue));
        _setValue(value);
    }
    const editor = useMemo(() => withEditList(withLayout(normalizeNodes)(withHistory(withReact(createEditor())))), [normalizeNodes])
    const onKeyDownListEditor = useMemo(() => editListEventHandler(editor), [editor]);
    useEffect(() => {
        if (isStale) {
            if (editor.selection !== null) {
                Transforms.deselect(editor);
            }
            _setValue(remoteValue);
        }
    }, [remoteValue, editor, isStale, _setValue]);

    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const renderElement = useCallback(props => <Element {...props} />, [])
    const classes = useStyles()
    return <div className={classes.editor + ' ' + className}>
        <Slate
            readOnly={readOnly}
            editor={editor}
            value={value}
            spellCheck
            onChange={newValue => setValue(newValue)}>
            <Toolbar onToolbarStick={onToolbarStick}>
                <MarkButton format="bold" icon={<FormatBold />} title={t('editor.bold')} />
                <MarkButton format="italic" icon={<FormatItalic />} title={t('editor.italic')} />
                <MarkButton format="underline" icon={<FormatUnderlined />} title={t('editor.underline')} />
                <BlockButton format="heading-two" icon={<LooksOne />} title={t('editor.heading')} />
                <BlockButton format="block-quote" icon={<FormatQuote />} title={t('editor.quote')} />
                <BlockButton format="ul-list" icon={<FormatListBulleted />} title={t('editor.list')} />
                <BlockButton format="ol-list" icon={<FormatListNumbered />} title={t('editor.number')} />
            </Toolbar>
            <Editable renderElement={renderElement}
                placeholder={placeholder}
                renderLeaf={renderLeaf} spellCheck onKeyDown={(event: any) => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event)) {
                            event.preventDefault();
                            toggleMark(editor, HOTKEYS[hotkey] as any);
                            return;
                        }
                    }
                    return onKeyDownListEditor(event);
                }}
            />
        </Slate>
    </div>
}


const useStyles = makeStyles((theme: Theme) => ({
    editor: {
        maxWidth: '900px',
        paddingLeft: theme.spacing(1),
        borderLeft: '3px solid transparent',
        marginBottom: theme.spacing(2),
        position: 'relative',
        '& li': {
            ...theme.typography.body1,
            fontSize: 18,
            lineHeight: 1.2,
            letterSpacing: '0.13px',
        }
    }
}));

export default withTranslation('translation')(Editor);
