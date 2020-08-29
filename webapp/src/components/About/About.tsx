// Import React dependencies.
import React, { useState, useMemo, useCallback } from "react";
// Import the Slate editor factory.
import Editor from '../Editor';
import { makeStyles, Button, Theme } from "@material-ui/core";
import { Transforms, Node } from 'slate'
import { ReactEditor } from 'slate-react'
import { useOrganizationGet, useOrganizationDB, useAdminLayout } from '../../contexts'
import { PrimaryButton } from "../Button";
import { withTranslation, WithTranslation } from "react-i18next";

const forcedLayout = (editor: ReactEditor, path: any) => {
    if (editor.children.length < 1) {
        const title = { type: 'heading-one', children: [{ text: '' }] }
        Transforms.insertNodes(editor, title, { at: path.concat(0) })
    }

    if (editor.children.length < 2) {
        const paragraph = { type: 'paragraph', children: [{ text: '' }] }
        Transforms.insertNodes(editor, paragraph, { at: path.concat(1) })
    }

    for (const [child, childPath] of Node.children(editor, path)) {
        if (childPath[0] === 0 && child.type !== 'heading-one') {
            Transforms.setNodes(editor, { type: 'heading-one' }, { at: childPath });
        }
        if (childPath[0] === 1 && child.type === 'heading-one') {
            Transforms.setNodes(editor, { type: 'paragraph' }, { at: childPath });
        }
    }
}

export type AboutProps = {
    document: string
} & WithTranslation;

const initialValue = [{ type: 'heading-one', children: [{ text: '' }] }]
const About = ({ document, t }: AboutProps) => {
    const aboutValue = useOrganizationGet({
        id: `${document}`,
    })
    const db = useOrganizationDB();
    const { setNavigationTitle } = useAdminLayout();
    const [value, setValue] = useState<any[]>(aboutValue ? aboutValue.content : initialValue)
    const title = useMemo(() => {
        const match = value.filter((element => element.type === 'heading-one'));
        if (match.length > 0 && match[0].children.length > 0) {
            return t('tabs.about') + ' / ' + match[0].children.map(({ text }: any) => text).join('');
        }
        return '';
    }, [value]);
    const onToolbarStick = useCallback((isSticky) => {
        if (!isSticky) {
            setNavigationTitle('');
            return;
        }
        setNavigationTitle(title);
    }, [title, setNavigationTitle])
    const save = async (evt: any) => {
        if (evt.preventDefault) evt.preventDefault();
        if (document === '') {
            throw new Error('empty id');
        }
        db.upsert(document, (doc: any) => {
            doc.content = value;
            return doc;
        });
    };

    const classes = useStyles();
    return <div className={classes.root}>
        <Editor className={classes.editor} onToolbarStick={onToolbarStick} name="AboutContent" remoteValue={aboutValue ? aboutValue.content : initialValue} placeholder={t('about.placeholder')} value={value} setValue={setValue} normalizeNodes={forcedLayout} />
        <div className={classes.actions}>
            <Button className={classes.cancel} variant="outlined" size="large" onClick={() => {
                setValue(aboutValue.content || []);
            }} tabIndex={-1}>{t('about.cancelBtn')}</Button>
            <PrimaryButton contained size="large" onClick={save} >{t('about.submitBtn')}</PrimaryButton>
        </div>
    </div>
}

export default withTranslation('organizations')(About);
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: theme.palette.background.paper,
        minHeight: 'calc(100vh - 288px)',
        display: 'flex',
        flexDirection: 'column',
    },
    editor: {
        flex: 1
    },
    cancel: {
        marginRight: theme.spacing(1)
    },
    actions: {
        flex: 0,
        justifyContent: 'flex-end',
        alignSelf: 'flex-end'
    }
}));
