import React from 'react';
import { PouchDB as ReactPouchDB } from "react-pouchdb/browser";
export type PouchDBProps = React.PropsWithChildren<{
    database: string,
}>
const PouchDB = ({ children, database }: PouchDBProps) => {
    return <ReactPouchDB name={database} >
        {children}
    </ReactPouchDB>
}

export default PouchDB; 