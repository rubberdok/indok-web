import { useQuery } from "@apollo/client";
import { FeaturedArchiveDocument } from "@generated/graphql";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
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
      marginLeft: "80px",
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
    year: {
      width: "100%",
      fontSize: 10,
      padding: -10,
    },
  })
);

const FeaturedDocumentsList: React.FC = () => {
  const { loading, data, error } = useQuery(FeaturedArchiveDocument);

  const classes = useStyles();
  if (loading) return <p style={{ textAlign: "center" }}></p>;

  if (error) return <p style={{ textAlign: "center" }}> Feil: {error.message} </p>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Fremhevede dokumenter
      </Typography>
      <ImageList cellHeight={"auto"} className={classes.img} cols={4} spacing={8}>
        {data?.featuredArchive.length ? (
          data.featuredArchive.map((doc) => (
            <ImageListItem key={0}>
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
          <Typography> Kunne ikke laste inn dokumenter </Typography>
        )}
      </ImageList>
    </>
  );
};

export default FeaturedDocumentsList;
