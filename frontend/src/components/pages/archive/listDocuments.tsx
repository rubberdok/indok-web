/* eslint-disable prettier/prettier */
import { useQuery } from "@apollo/client";
import Content from "@components/ui/Content";
import ImageCard from "@components/ui/ImageCard";
import { GET_DOCSBYTYPE } from "@graphql/archive/queries";
import { Document } from "@interfaces/archives";
import Button from "@material-ui/core/Button";
import GridList from "@material-ui/core/GridList";
import Typography from "@material-ui/core/Typography";
import GridListTile from "@material-ui/core/GridListTile";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
    image: {
      width: "128px",
      height: "128px",
    },
    img: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
    article: {
      width: "100%",
    },
  })
);

interface ListDocumentsProps {
  document_types: string[];
}

const ListDocuments: React.FC<ListDocumentsProps> = ({ document_types }) => {
  const { refetch, loading, data, error } = useQuery(GET_DOCSBYTYPE, { variables: { document_types } });

  useEffect(() => {
    refetch({ document_types });
  }, [document_types]);

  const classes = useStyles();
  if (loading) return <p style={{ textAlign: "center" }}>Laster...</p>;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <GridList cellHeight={128} className={classes.img} cols={4}>
      {data.archiveByType.length ? (
        data.archiveByType.map((doc: Document) => (
          <GridListTile key={0}>
            <Card>
              <CardActions>
                <Button
                  key={doc.id}
                  className={classes.article}
                  onClick={() => {
                    window.open(doc.url, "_blank");
                  }}
                >
                  <ImageCard key={doc.id} title={doc.title} subtitle={doc.typeDoc} imageUrl={doc.thumbnail} />
                </Button>
              </CardActions>
            </Card>
          </GridListTile>
        ))
      ) : (
        <Content>
          <Typography> Fant ingen dokumenter som passer søket ditt </Typography>
        </Content>
      )}
    </GridList>
  );
};

export default ListDocuments;
