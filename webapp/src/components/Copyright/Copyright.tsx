import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
const Copyright = () =>
    <Typography component="div" variant="caption" color="textSecondary" align="center">
        Made with <span role="img" arial-label="brought to you with with love">{"❤️"}</span>
        <Link color="inherit" href="https://tandem.pt/">by Tandem</Link> and contributors
        </Typography>

export default Copyright;