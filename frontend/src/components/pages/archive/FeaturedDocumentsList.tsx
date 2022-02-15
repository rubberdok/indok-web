import { useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { FeaturedArchiveDocument } from "src/generated/graphql";

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
      <GridList cellHeight={"auto"} className={classes.img} cols={4} spacing={8}>
        {data?.featuredArchive.length ? (
          data.featuredArchive.map((doc) => (
            <GridListTile key={0}>
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
            </GridListTile>
          ))
        ) : (
          <Typography> Kunne ikke laste inn dokumenter </Typography>
        )}
      </GridList>
    </>
  );
};

export default FeaturedDocumentsList;
