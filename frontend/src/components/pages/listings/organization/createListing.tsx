import { useState } from "react";
import { Listing } from "@interfaces/listings";
import { Organization } from "@interfaces/organizations";
import { CREATE_LISTING } from "@graphql/listings/mutations";
import { GET_ORGANIZATION } from "@graphql/orgs/queries";
import { useMutation } from "@apollo/client";
import { TextField } from "@material-ui/core";

// component for authorized organization members to create new listings
// props: the organization for which to create the listing
const CreateListing: React.FC<{ organization: Organization }> = ({ organization }) => {
  //state to manage the new listing before posting
  const [newListing, setNewListing] = useState<Listing>({} as Listing);

  // mutation to create the new listing, and update the cache to show it instantly
  const [createListing] = useMutation<{ createListing: { listing: Listing } }>(CREATE_LISTING, {
    // updates the cache upon creating the listing, so it can show up instantly
    update: (cache, { data }) => {
      const newListing = data?.createListing.listing;
      const cachedOrg = cache.readQuery<{ org: Organization }>({
        query: GET_ORGANIZATION,
        variables: { orgId: parseInt(organization.id) },
      });
      if (cachedOrg && newListing) {
        cache.writeQuery({
          query: GET_ORGANIZATION,
          variables: { orgId: parseInt(organization.id) },
          data: {
            organization: {
              listings: [...(cachedOrg.org.listings ?? []), newListing],
            },
          },
        });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createListing({
          variables: {
            title: newListing.title,
            description: newListing.description,
            startDatetime: newListing.startDatetime,
            deadline: newListing.deadline,
            endDatetime: newListing.endDatetime,
            url: "www.google.com",
            organizationId: organization.id,
          },
        });
        //TODO: properly reset newListing state
        setNewListing({ ...newListing, title: "", description: "" });
      }}
    >
      <TextField
        title="Navn på vervet: "
        onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
        value={newListing.title}
      />
      <br />
      <TextField
        title="Beskrivelse av vervet: "
        multiline
        rows={4}
        onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
        value={newListing.description}
      />
      <br />
      Starttid:{" "}
      <input
        type="datetime-local"
        onChange={(e) => setNewListing({ ...newListing, startDatetime: e.target.value })}
        value={newListing.startDatetime}
      />
      <br />
      Frist:{" "}
      <input
        type="datetime-local"
        onChange={(e) => setNewListing({ ...newListing, deadline: e.target.value })}
        value={newListing.deadline}
      />
      <br />
      Slutt:{" "}
      <input
        type="datetime-local"
        onChange={(e) => setNewListing({ ...newListing, endDatetime: e.target.value })}
        value={newListing.endDatetime}
      />
      <br />
      <button type="submit">Legg til verv</button>
    </form>
  );
};

export default CreateListing;
