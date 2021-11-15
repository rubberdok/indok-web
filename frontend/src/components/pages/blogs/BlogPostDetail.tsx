import { Container, Paper, Box, Grid, Typography, Divider } from "@material-ui/core";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";

// Function to parse date to format: "dd. month yyyy"
const parseDate = (date: string): string => {
  const months = [
    "januar",
    "februar",
    "mars",
    "april",
    "mai",
    "juni",
    "juli",
    "august",
    "september",
    "oktober",
    "november",
    "desember",
  ];
  const day = dayjs(date).date();
  const month = months[dayjs(date).month()];
  const year = dayjs(date).year();
  return `${day}. ${month} ${year}`;
};

const useStyles = makeStyles((theme) => ({
  image: {
    position: "relative",
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: "auto",
    height: "min(50vw, 450px)",
    position: "relative",
    display: "flex",
  },
  paper: {
    margin: "0 min(0vw, 60px)",
  },
}));

interface Props {
  title: string;
  text: string;
  publishDate: string;
  firstName: string;
  lastName: string;
}

export const BlogPostDetail: React.VFC<Props> = ({ title, text, publishDate, firstName, lastName }) => {
  const classes = useStyles();

  return (
    <>
      <Container>
        <Box my={5}>
          <Box>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item md={10} sm={11} xs={12}>
                <Box>
                  <Box mb={2}>
                    <Typography variant="h2">{title}</Typography>
                  </Box>
                  <Box className={classes.imageContainer}>
                    <Image alt="blog-image" src="/img/eivbilde.jpg" layout="fill" objectFit="cover" />
                  </Box>
                  <Box mt={2}>
                    <Typography variant="caption">{`Av ${firstName} ${lastName}, ${parseDate(
                      publishDate
                    )}`}</Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography gutterBottom>{text}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};
