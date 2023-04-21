import { Create } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";

import { Link, Markdown } from "@/components";
import { ListingFragment } from "@/generated/graphql";

type Props = { listing: ListingFragment };

/** Component for authorized organization members to administer their listing. */
export const OrganizationListing: React.FC<Props> = ({ listing }) => (
  <Grid container direction="column" spacing={1}>
    <Grid item>
      <Card>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {listing.title}
          </Typography>
          <Markdown>{listing.description}</Markdown>
        </CardContent>
        <CardActions>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button
                component={Link}
                noLinkStyle
                href={`/orgs/${listing.organization.id}/listings/${listing.id}/edit/`}
                startIcon={<Create />}
              >
                Rediger
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  </Grid>
);
