import { Create } from "@mui/icons-material";
import { Typography, Card, CardContent, Grid, CardActions, Button } from "@mui/material";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import * as components from "@components/MarkdownForm/components";
import { Listing } from "@interfaces/listings";

/**
 * Component for authorized organization members to administer their listing.
 *
 * Props:
 * - the listing to administrate
 */
const OrganizationListing: React.FC<{ listing: Listing }> = ({ listing }) => (
  <Grid container direction="column" spacing={1}>
    <Grid item>
      <Card>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {listing.title}
          </Typography>
          <ReactMarkdown components={components}>{listing.description}</ReactMarkdown>
        </CardContent>
        <CardActions>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link passHref href={`/orgs/${listing.organization.id}/listings/${listing.id}/edit/`}>
                <Button startIcon={<Create />}>Rediger</Button>
              </Link>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  </Grid>
);

export default OrganizationListing;
