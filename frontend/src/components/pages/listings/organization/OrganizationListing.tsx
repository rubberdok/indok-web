import { Listing } from "@interfaces/listings";
import { Typography, Card, CardContent, Grid, CardActions, Button } from "@material-ui/core";
import Link from "next/link";
import { Create } from "@material-ui/icons";
import renderers from "@components/pages/listings/markdown/renderers";
import ReactMarkdown from "react-markdown";

/**
 * component for authorized organization members to administer their listing
 * props: the listing to administrate
 */
const OrganizationListing: React.FC<{ listing: Listing }> = ({ listing }) => (
  <Grid container direction="column" spacing={1}>
    <Grid item>
      <Card>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {listing.title}
          </Typography>
          <ReactMarkdown renderers={renderers}>{listing.description}</ReactMarkdown>
        </CardContent>
        <CardActions>
          <Link passHref href={`/orgs/${listing.organization.id}/listings/${listing.id}/edit/`}>
            <Button startIcon={<Create />}>Rediger</Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  </Grid>
);

export default OrganizationListing;
