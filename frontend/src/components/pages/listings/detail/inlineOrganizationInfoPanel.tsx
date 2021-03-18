import { Organization } from "@interfaces/organizations";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Card, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import { Spacing } from "@material-ui/system";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";


interface InlineOrganizationInfoPanelProps {
  organization: Organization;
}

const useStyles = makeStyles((theme) => ({

  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    objectFit: "contain",
  },

}));

// component for organization detail on mobile
const InlineOrganizationInfoPanel: React.FC<InlineOrganizationInfoPanelProps> = ({ organization }) => {
  const classes = useStyles();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="organization-info" id="organization-info">
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item>
            <CardMedia
              component="img"
              className={classes.large}
              image={organization?.color || "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"}
              title="organization logo"
            />
          </Grid>
          <Grid item>
            <Typography variant="h5" component="h3">
              {organization.name}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>{organization.description}</AccordionDetails>
    </Accordion>
  );
};

export default InlineOrganizationInfoPanel;
