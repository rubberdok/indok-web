import { Container, Paper, Box, Grid, Typography, Divider, Card, CardContent } from "@material-ui/core";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";
import nb from "dayjs/locale/nb";
import ReactMarkdown from "react-markdown";
import * as components from "@components/markdown/components";
dayjs.locale(nb);

// Function to parse date to format: "dd. month yyyy"
const parseDate = (dateString: string): string => {
  const date = dayjs(dateString);
  return date.format("D. MMMM YYYY");
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
          <Grid container alignItems="center" justifyContent="center">
            <Grid item md={6}>
              <Card>
                <CardContent>
                  <Grid container direction="column" spacing={8}>
                    <Grid item>
                      <Typography align="center" variant="h1">
                        {title}
                      </Typography>
                    </Grid>
                    <Grid className={classes.imageContainer}>
                      <Image alt="blog-image" src="/img/eivbilde.jpg" layout="fill" objectFit="cover" />
                    </Grid>
                    <Grid item>
                      <Typography variant="caption">
                        Av {firstName} {lastName}, {parseDate(publishDate)}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ReactMarkdown components={components}>{text}</ReactMarkdown>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};
