import { Card, CardContent, Grid, makeStyles } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import renderers from "@components/pages/listings/markdown/renderer";

import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
  },
  description: {
    wordBreak: "break-word",
  },
}));

/**
 * component for the main body of a listing's detail
 * props: the listing to render
 */
const ListingBody: React.FC<{
  body: string;
}> = ({ body }) => {
  const classes = useStyles();

  return (
    <Grid item xs={10}>
      <Card className={classes.root}>
        <CardContent>
          <ReactMarkdown
            renderers={renderers}
          >
            {body}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ListingBody;
