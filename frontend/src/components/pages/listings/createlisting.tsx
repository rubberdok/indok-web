import TextField from "./textfield";
import { useState } from "react";
import { Listing } from "@interfaces/listings";
import { ADD_LISTING } from "@graphql/listings/mutations";
import { LISTING_FRAGMENT } from "@graphql/listings/queries";
import { useMutation } from "@apollo/client";

const CreateListing = () => {
    const [newListing, setNewListing] = useState<Listing>({} as Listing);
    const [addListing] = useMutation(ADD_LISTING, {
        update: (cache, { data }) => {
            cache.modify({
                fields: {
                    allListings: (existingListings) => {
                        const newListing = cache.writeFragment<Listing>({
                            data: data!.createListing.listing,
                            fragment: LISTING_FRAGMENT,
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
                addListing({
                    variables: {
                        title: newListing.title,
                        description: newListing.description,
                        startDateTime: newListing.startDateTime,
                        deadline: newListing.deadline,
                        endDateTime: newListing.endDateTime,
                        url: "www.google.com",
                    },
                });
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
