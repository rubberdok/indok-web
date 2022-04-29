import { useQuery } from "@apollo/client";
import { ArchiveByTypesDocument } from "@generated/graphql";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";

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
      width: "90px",
      height: "148px",
      alignItems: "start",
    },
    img: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
    article: {
      width: "100%",
      height: "160px",
    },
    header: {
      width: "100%",
      fontSize: 10,
      padding: -10,
      textTransform: "none",
    },
  })
);

interface DocumentListProps {
  document_types: string[];
  year: number | null;
  names: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ document_types, year, names }) => {
  const { refetch, loading, data, error } = useQuery(ArchiveByTypesDocument, {
    variables: { document_types, year, names },
  });

  useEffect(() => {
    refetch({ document_types, year });
  }, [document_types, year]);

  const classes = useStyles();
  if (loading) return <p style={{ textAlign: "center" }}></p>;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Alle dokumenter
      </Typography>
      <ImageList cellHeight={"auto"} className={classes.img} cols={4} spacing={8}>
        {data?.archiveByTypes.length ? (
          data?.archiveByTypes.map((doc) => (
            <ImageListItem key={doc.id}>
              <Card className={classes.root} elevation={1}>
                <Button
                  key={doc.id}
                  className={classes.article}
                  onClick={() => {
                    window.open(doc.webLink ?? undefined, "_blank");
                  }}
                >
                  <CardMedia
                    key={doc.id}
                    className={classes.image}
                    component="img"
                    height="128"
                    image={doc.thumbnail ?? undefined}
                  />
                  <CardHeader
                    className={classes.header}
                    disableTypography
                    title={
                      <Typography
                        component="h2"
                        variant="inherit"
                        paragraph
                        style={{ fontSize: "5", fontWeight: "lighter", textAlign: "center" }}
                      >
                        {doc.title}
                      </Typography>
                    }
                    subheader={
                      <Typography
                        component="h4"
                        variant="inherit"
                        style={{ fontWeight: "lighter", textAlign: "center" }}
                      >
                        {doc.typeDoc
                          .replace(/_/g, " ")
                          .replace("ARBOKER", "ÅRBØKER")
                          .replace("STOTTE FRA HS", "STØTTE FRA HS")}
                      </Typography>
                    }
                  />
                </Button>
              </Card>
            </ImageListItem>
          ))
        ) : (
          <Typography> Fant ingen dokumenter som samsvarer med søket ditt </Typography>
        )}
      </ImageList>
    </>
  );
};

export default DocumentList;
