import { Organization } from "@interfaces/organizations";
import { Grid, Card, CardMedia, CardContent, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  organization: {
    flexDirection: "column",
    justifyContent: "space-between",
  },

  organizationContent: {
    flexDirection: "column",
    padding: theme.spacing(2),
    spacing: theme.spacing(10),
  },

  media: {
    maxHeight: 150,
    width: "1",
    objectFit: "contain",
    padding: 8,
  },
}));

interface OrganizationInfoPanelProps {
  organization: Organization;
}

// component for organization detail on desktop
const OrganizationInfoPanel: React.FC<OrganizationInfoPanelProps> = ({ organization }) => {
  const classes = useStyles();
  return (
    <Card>
      <CardMedia
        component="img"
        className={classes.media}
        image={organization?.color || "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"}
        title="organization logo"
      />

      <CardContent>
        <Grid container className={classes.organizationContent} spacing={2}>
          <Grid item>
            <Typography variant="h3" component="h3">
              {organization.name || "Ingen organisasjon"}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="body1">{organization.description || "Ingen organisasjon"}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrganizationInfoPanel;
