import Layout from "@components/Layout";
import Navbar from "@components/navbar/Navbar";
import { Box, Button, Container, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  })
);

const Fonts: NextPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <Navbar />
      <Container>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6" gutterBottom>
          Heading 6
        </Typography>
        <Typography variant="overline" gutterBottom>
          Overline heading
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pretium tellus non nisi pretium, non finibus
          erat varius. Fusce quis porta augue, eget pretium metus. Nunc finibus, eros nec posuere volutpat, eros libero
          tincidunt mauris, sit amet lobortis enim elit ut est. Etiam ac massa sed tellus cursus auctor. Ut iaculis
          porta urna egestas posuere. Maecenas felis lectus, sollicitudin id ultrices sed, egestas eget tortor. Morbi
          vel dui eget lectus posuere vestibulum. Nam scelerisque neque neque, a faucibus leo cursus sit amet. Morbi
          congue ante nec velit rutrum finibus. Praesent sit amet varius massa.
        </Typography>

        <Typography variant="body1" paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pretium tellus non nisi pretium, non finibus
          erat varius. Fusce quis porta augue, eget pretium metus. Nunc finibus, eros nec posuere volutpat, eros libero
          tincidunt mauris, sit amet lobortis enim elit ut est. Etiam ac massa sed tellus cursus auctor. Ut iaculis
          porta urna egestas posuere. Maecenas felis lectus, sollicitudin id ultrices sed, egestas eget tortor. Morbi
          vel dui eget lectus posuere vestibulum. Nam scelerisque neque neque, a faucibus leo cursus sit amet. Morbi
          congue ante nec velit rutrum finibus. Praesent sit amet varius massa.
        </Typography>
        <Typography variant="body2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pretium tellus non nisi pretium, non finibus
          erat varius. Fusce quis porta augue, eget pretium metus. Nunc finibus, eros nec posuere volutpat, eros libero
          tincidunt mauris, sit amet lobortis enim elit ut est. Etiam ac massa sed tellus cursus auctor. Ut iaculis
          porta urna egestas posuere. Maecenas felis lectus, sollicitudin id ultrices sed, egestas eget tortor. Morbi
          vel dui eget lectus posuere vestibulum. Nam scelerisque neque neque, a faucibus leo cursus sit amet. Morbi
          congue ante nec velit rutrum finibus. Praesent sit amet varius massa.
        </Typography>
        <Box mb={10} />
        <div>
          <div>
            <Button size="small" className={classes.margin}>
              Small
            </Button>
            <Button size="medium" className={classes.margin}>
              Medium
            </Button>
            <Button size="large" className={classes.margin}>
              Large
            </Button>
          </div>
          <div>
            <Button variant="outlined" size="small" color="primary" className={classes.margin}>
              Small
            </Button>
            <Button variant="outlined" size="medium" color="primary" className={classes.margin}>
              Medium
            </Button>
            <Button variant="outlined" size="large" color="primary" className={classes.margin}>
              Large
            </Button>
          </div>
          <div>
            <Button variant="contained" size="small" color="primary" className={classes.margin}>
              Small
            </Button>
            <Button variant="contained" size="medium" color="primary" className={classes.margin}>
              Medium
            </Button>
            <Button variant="contained" size="large" color="primary" className={classes.margin}>
              Large
            </Button>
          </div>
        </div>
        <Box mb={10} />
      </Container>
    </Layout>
  );
};

export default Fonts;
