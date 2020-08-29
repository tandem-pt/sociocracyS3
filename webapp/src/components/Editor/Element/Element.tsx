import React from 'react';
import { Title, Blockquote, ReadableText, ListItem } from '.';
const Element = ({ element, attributes, children, }: any) => {
    switch (element?.type) {
        case 'block-quote':
            return <Blockquote attributes={attributes} >{children}</Blockquote>
        case 'ul-list':
            return <ul {...attributes} >{children}</ul>
        case 'ol-list':
            return <ol {...attributes}>{children}</ol>
        case 'heading-one':
            return <Title variant="h1" attributes={attributes}>{children}</Title>
        case 'heading-two':
            return <Title variant="h2" attributes={attributes}>{children}</Title>
        case 'list-item':
            return <ListItem {...attributes}>{children}</ListItem>
        default:
            return <ReadableText {...attributes}>{children}</ReadableText>
    }
}
export default Element;