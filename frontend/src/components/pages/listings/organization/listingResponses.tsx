import { Listing, Response } from "@interfaces/listings";
import { useQuery, useMutation } from "@apollo/client";
import { RESPONSES } from "@graphql/listings/queries";
import { useState } from "react";
import OrganizationListing from "@components/pages/listings/organization/organizationListing";
import { Grid, Box, Tabs, Tab } from "@material-ui/core";

const ListingResponses: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [selectedResponse, selectResponse] = useState<Response | null>(null);
  const { loading, error, data } = useQuery<{ listing: { responses: Response[] } }>(RESPONSES, {
    variables: { ID: Number(listing.id) },
  });
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <Grid container direction="row">
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedResponse}
            onChange={(event, newResponse) => {
              selectResponse(newResponse);
            }}
          >
            <Tab value={null} label="Se verv og søknad" />
            {data.listing.responses.map((response, index) => (
              <Tab
                key={index}
                value={response}
                label={`${response.applicant.firstName} ${response.applicant.lastName}`}
              />
            ))}
          </Tabs>
          <Box marginLeft={3}>
            {selectedResponse ? <p>{selectedResponse.response}</p> : <OrganizationListing listing={listing} />}
          </Box>
        </Grid>
      )}
    </>
  );
};

export default ListingResponses;
