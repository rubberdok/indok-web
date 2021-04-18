import { Listing } from "@interfaces/listings";
import { Typography, Card, CardContent, Grid } from "@material-ui/core";

/**
 * component for authorized organization members to administer their listing
 * props: the listing to administrate
 */
// TODO: functionality to edit the listing's name/description
const OrganizationListing: React.FC<{ listing: Listing }> = ({ listing }) => (
  <Grid container direction="column" spacing={1}>
    <Grid item>
      <Card>
        <CardContent>
          <Typography variant="h3">{listing.title}</Typography>
          <Typography>{listing.description}</Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default OrganizationListing;
