import React from 'react';
import { usePouchDBSync, useProfile, useOrganizationFind } from "../../contexts";

const OnBoard = () => {
    const profile = useProfile();
    const organizationDocs = useOrganizationFind({ selector: {} })
    const syncState = usePouchDBSync();
    return <pre><code>{JSON.stringify({ profile, organizationDocs, syncState }, undefined, 2)}</code></pre>
}

export default OnBoard;