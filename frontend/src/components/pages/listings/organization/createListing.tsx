import TextField from "@components/ui/formComponents/textfield";
import { useState } from "react";
import { Listing } from "@interfaces/listings";
import { Organization } from "@interfaces/organizations";
import { CREATE_LISTING } from "@graphql/listings/mutations";
import { useMutation, gql } from "@apollo/client";

// component for authorized organization members to create new listings
// props: the organization for which to create the listing
const CreateListing: React.FC<{ organization: Organization }> = ({ organization }) => {
  //state to manage the new listing before posting
  const [newListing, setNewListing] = useState<Listing>({} as Listing);

  // mutation to create the new listing, and update the cache to show it instantly
  const [createListing] = useMutation<{ createListing: { listing: Listing } }>(CREATE_LISTING, {
    update: (cache, { data }) => {
      data &&
        cache.modify({
          fields: {
            listings: (existingListings) => {
              // creates a fragment of the new listing, as that is what the cache stores
              const newListing = cache.writeFragment<Listing>({
                data: data.createListing.listing,
                fragment: gql`
                  fragment NewListing on Listing {
                    id
                  }
                `,
              });
              return [...existingListings, newListing];
            },
          },
        });
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
        size="short"
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
