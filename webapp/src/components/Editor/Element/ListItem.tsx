import React from 'react';
import { ListItemText } from '@material-ui/core'
import ReadableText from './ReadableText';
const ListItem = React.forwardRef(({ children, numbered = false, ...attributes }: React.PropsWithChildren<any>, ref) => {
    return <li  {...attributes} ref={ref} >
        <ListItemText >
            <ReadableText>{children}</ReadableText>
        </ListItemText>
    </li>
})


export default ListItem;
