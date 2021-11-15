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
  },
  imageContainer: {
    width: "auto",
    height: "500px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    margin: "0 5vw",
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
  const style = useStyles();

  return (
    <>
      <Container>
        <Box my={5}>
          <Paper className={style.paper}>
            <Box p={5}>
              <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="h2">{title}</Typography>
                    <Box className={style.imageContainer}>
                      <Image alt="blog-image" src="/img/eivbilde.jpg" layout="fill" objectFit="contain" />
                    </Box>
                    <Typography>{`${firstName} ${lastName} ${parseDate(publishDate)}`}</Typography>
                    <Typography>{text}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};
