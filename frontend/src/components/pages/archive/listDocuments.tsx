import { useQuery } from "@apollo/client";
import Content from "@components/ui/Content";
import { GET_DOCSBYFILTERS } from "@graphql/archive/queries";
import { Document } from "@interfaces/archives";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      marginLeft: "70px",
    },
    image: {
      width: "128px",
      height: "128px",
      alignItems: "start",
    },
    img: {
      marginLeft: "80px",
      maxWidth: "100%",
      maxHeight: "100%",
    },
    article: {
      width: "100%",
    },
    header: {
      width: "100%",
      fontSize: 10,
      padding: -10,
    },
  })
);

interface ListDocumentsProps {
  document_types: string[];
  year: number;
}

const ListDocuments: React.FC<ListDocumentsProps> = ({ document_types, year }) => {
  const { refetch, loading, data, error } = useQuery(GET_DOCSBYFILTERS, { variables: { document_types, year } });

  useEffect(() => {
    refetch({ document_types, year });
  }, [document_types, year]);

  const classes = useStyles();
  if (loading) return <p style={{ textAlign: "center" }}></p>;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <Container>
      <Typography variant="body1">Alle dokumenter</Typography>
      <GridList cellHeight={144} className={classes.img} cols={4} spacing={8}>
        {data.archiveByTypes.length ? (
          data.archiveByTypes.map((doc: Document) => (
            <GridListTile key={0}>
              <Card className={classes.root} elevation={1}>
                <CardActionArea>
                  <Button
                    key={doc.id}
                    className={classes.article}
                    onClick={() => {
                      window.open(doc.url, "_blank");
                    }}
                  >
                    <CardMedia
                      key={doc.id}
                      className={classes.image}
                      component="img"
                      height="128"
                      image={doc.thumbnail}
                    />
                    <CardHeader
                      className={classes.header}
                      title={doc.title}
                      subheader={doc.typeDoc.replace(/_/g, " ")}
                      titleTypographyProps={{
                        variant: "inherit",
                        component: "h2",
                        align: "left",
                      }}
                      subheaderTypographyProps={{
                        variant: "inherit",
                        component: "h4",
                        align: "left",
                      }}
                    />
                  </Button>
                </CardActionArea>
              </Card>
            </GridListTile>
          ))
        ) : (
          <Container>
            <Typography> Fant ingen dokumenter som samsvarer med søket ditt </Typography>
          </Container>
        )}
      </GridList>
    </Container>
  );
};

export default ListDocuments;
