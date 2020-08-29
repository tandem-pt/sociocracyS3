
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { LIST_TYPES } from './constants';

export const isBlockActive = (editor: Editor, format: any) => {
    const match = Editor.nodes(editor, {
        match: n => n.type === format,
    })[Symbol.iterator]().next().value;
    return !!match
}

export const isMarkActive = (editor: Editor, format: any) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

export const isTitle = (editor: Editor) => {
    const match = Editor.nodes(editor, {
        match: n => n.type === 'heading-one',
    })[Symbol.iterator]().next().value;
    const marks = Editor.marks(editor)
    const isMarked = marks ? marks['heading-one'] === true : false

    return !!match || isMarked
}

export const toggleBlock = (editor: Editor, format: any) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n => LIST_TYPES.includes(n.type as string),
        split: true,
    })

    Transforms.setNodes(editor, {
        type: isList ? `list-item` : isActive ? 'paragraph' : format,
    })

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

export const toggleMark = (editor: Editor, format: any) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

export const withLayout = (normalize: any) => {
    return (editor: ReactEditor) => {
        const { normalizeNode } = editor
        editor.normalizeNode = ([node, path]: any) => {
            if (path.length === 0) {
                normalize(editor, path);
            }

            return normalizeNode([node, path])
        }

        return editor
    }
}