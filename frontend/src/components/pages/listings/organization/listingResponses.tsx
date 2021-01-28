import { Listing, Response } from "@interfaces/listings";
import { useQuery, useMutation } from "@apollo/client";
import { RESPONSES } from "@graphql/listings/queries";
import { DELETE_RESPONSE } from "@graphql/listings/mutations";
import { useState } from "react";
import ListItem from "@components/ui/listItem";
import List from "@components/ui/list";
import OrganizationListing from "@components/pages/listings/organization/organizationListing";

//Temporary styling components for demo
//TODO: implement proper styledcomponents
const horizontal = {
  display: "flex",
};
const flexChild = {
  marginLeft: "50px",
};
const responseView = {
  backgroundColor: "#F5F0EB",
  borderRadius: "6px",
  padding: 10,
  border: "1px solid grey",
  width: "50%",
};

const ListingResponses: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [selectedResponse, selectResponse] = useState<Response>();
  const { loading, error, data } = useQuery<{ listing: { responses: Response[] } }>(RESPONSES, {
    variables: { ID: Number(listing.id) },
  });
  const [deleteResponse] = useMutation<{ deleteResponse: { ok: boolean; response: Response } }>(DELETE_RESPONSE);
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      {data && (
        <div style={horizontal}>
          <List>
            {data.listing.responses.map((response) => (
              <ListItem
                mainText={response.applicant.firstName + " " + response.applicant.lastName}
                subText={response.applicant.year + ". klasse"}
                key={response.id}
                selected={response === selectedResponse}
                onClick={() => {
                  if (response === selectedResponse) {
                    selectResponse(undefined);
                  } else {
                    selectResponse(response);
                  }
                }}
              />
            ))}
          </List>
          {selectedResponse ? (
            <div style={{ ...responseView, ...flexChild }}>{selectedResponse.response}</div>
          ) : (
            <div style={flexChild}>
              <OrganizationListing listing={listing} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ListingResponses;
