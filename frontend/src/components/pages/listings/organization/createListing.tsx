import TextField from "../formComponents/textfield";
import { useState } from "react";
import { Listing, Organization } from "@interfaces/listings";
import { CREATE_LISTING } from "@graphql/listings/mutations";
import { useMutation, gql } from "@apollo/client";

const CreateListing: React.FC<{ organization?: Organization }> = ({ organization }) => {
    const [newListing, setNewListing] = useState<Listing>({} as Listing);
    const [createListing] = useMutation<{ createListing: { listing: Listing } }>(CREATE_LISTING, {
        update: (cache, { data }) => {
            data &&
                cache.modify({
                    fields: {
                        listings: (existingListings) => {
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
                createListing(
                    organization
                        ? {
                              variables: {
                                  title: newListing.title,
                                  description: newListing.description,
                                  startDateTime: newListing.startDateTime,
                                  deadline: newListing.deadline,
                                  endDateTime: newListing.endDateTime,
                                  url: "www.google.com",
                                  organizationId: organization.id,
                              },
                          }
                        : {
                              variables: {
                                  title: newListing.title,
                                  description: newListing.description,
                                  startDateTime: newListing.startDateTime,
                                  deadline: newListing.deadline,
                                  endDateTime: newListing.endDateTime,
                                  url: "www.google.com",
                              },
                          }
                );
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
            Start time:
            <input
                type="datetime-local"
                onChange={(e) => setNewListing({ ...newListing, startDateTime: e.target.value })}
                value={newListing.startDateTime}
            />
            <br />
            Deadline:
            <input
                type="datetime-local"
                onChange={(e) => setNewListing({ ...newListing, deadline: e.target.value })}
                value={newListing.deadline}
            />
            <br />
            End time:
            <input
                type="datetime-local"
                onChange={(e) => setNewListing({ ...newListing, endDateTime: e.target.value })}
                value={newListing.endDateTime}
            />
            <br />
            <button type="submit">Add listing</button>
        </form>
    );
};

export default CreateListing;
