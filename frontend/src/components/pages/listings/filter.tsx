import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Grid,
  Hidden,
  makeStyles,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  filter: {
    width: "100%",
  },
}));

// component to filter the overview of listings (not yet implemented fully)
const Filter: React.FC<{ filters: string[] }> = ({ filters }) => {
  const classes = useStyles();

  return (
    <>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid item xs={8}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="filter-content" id="filter-header">
              <Typography variant="h2" component="h4">
                Filter
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                {filters.map((filter, index) => (
                  <li key={index}>{filter}</li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Hidden>
      <Hidden only={["xs", "sm"]}>
        <Grid item xs={4}>
          <Card className={classes.filter}>
            <CardContent>
              <Typography variant="h2" component="h4">
                Filter
              </Typography>
              <ul>
                {filters.map((filter, index) => (
                  <li key={index}>{filter}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Hidden>
    </>
  );
};

export default Filter;
