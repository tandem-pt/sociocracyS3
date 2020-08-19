import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import { withStyles, WithStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Link from '@material-ui/core/Link';

const styles = (theme: Theme) => ({
    list: {
        padding: 0,
        marginLeft: theme.spacing(2)
    },
    listItem: {
        listStyle: 'none',
        marginTop: theme.spacing(1),
        '& > span .MuiTypography-body1': {
            fontSize: theme.typography.body2.fontSize,
        },
        '& > span ul': {
            paddingLeft: theme.spacing(1),
        },
        '& > span li': {
            marginTop: 0,
            listStyle: 'circle'
        }
    }
});

const options = (classes: any) => ({
    overrides: {
        h1: {
            component: Typography,
            props: {
                gutterBottom: true,
                variant: 'h5',
            },
        },
        h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
        h3: { component: Typography, props: { gutterBottom: true, variant: 'subtitle1' } },
        h4: {
            component: Typography,
            props: { gutterBottom: true, variant: 'caption', paragraph: true },
        },
        p: { component: Typography, props: { paragraph: true } },
        a: { component: Link },
        ul: {
            component: 'ul',
            props: { className: classes.list }
        },
        li: {
            component: (props: any) => (
                <li className={classes.listItem}>
                    <Typography component="span" {...props} />
                </li>
            ),
        },
    },
});

type MarkdownProps = {
    filename: string,
    lang: string,
};
const Markdown = ({ filename, lang, classes }: MarkdownProps & WithStyles<typeof styles>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");

    useEffect(() => {
        const fetchFile = async (language = 'en') => {
            if (isLoading) return;
            const result = await fetch(`/markdown/${language}/${filename}.md`, {
                credentials: "include"
            });
            if (result.ok) {
                setText(await result.text());
            } else if (language !== 'en') {
                // Fallback to english
                await fetchFile('en');
            } else {
                setText(`can not load /markdown/${language}/${filename}.md`);
            }
        }
        setIsLoading(true);
        fetchFile(lang).then(() => setIsLoading(false));
    }, [setText, setIsLoading]);
    return isLoading ? <Skeleton variant="text" height={33} /> : <ReactMarkdown options={options(classes)} children={text} />;
}

export default withStyles(styles)(Markdown);