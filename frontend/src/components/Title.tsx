import { Box, Grid, Typography, useTheme } from "@material-ui/core";

type Props = {
  children: string;
};

const Title: React.FC<Props> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box width="100%" pt={10} pb={7} mb={4} bgcolor={theme.palette.background.paper}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid container item direction="column" alignItems="flex-start" justify="center" md={8}>
          <Grid item>
            <Typography variant="h1" gutterBottom>
              {children}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Title;
