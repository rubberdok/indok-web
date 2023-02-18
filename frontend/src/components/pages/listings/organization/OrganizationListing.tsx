import { Create } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

import { Link } from "@/components";
import * as components from "@/components/MarkdownForm/components";
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
          <ReactMarkdown components={components}>{listing.description}</ReactMarkdown>
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
