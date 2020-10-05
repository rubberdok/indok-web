import TextField from "./textfield";
import { useState } from "react";
import { ListingType } from "../../../interfaces/listings";
import { ADD_LISTING } from "../../../graphql/listings/mutations";
import { useMutation } from "@apollo/client";

const CreateListing = () => {
    const [newListing, setNewListing] = useState<ListingType>({} as ListingType);
    const [addListing] = useMutation(ADD_LISTING);
    return (
        <form>
            <TextField
                title="Navn på stillingen: "
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
            />
            <br />
            <TextField
                title="Beskrivelse av stillingen: "
                size="short"
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
            />
            <br />
            <button
                onClick={() =>
                    addListing({
                        variables: {
                            title: newListing.title,
                            description: newListing.description,
                            startDateTime: "2020-09-24T11:00:00+00:00",
                            deadline: "2020-09-24T11:00:00+00:00",
                            endDateTime: "2020-09-24T11:00:00+00:00",
                            url: "www.google.com",
                        },
                    })
                }
            >
                Add listing
            </button>
        </form>
    );
};

export default CreateListing;
