import { gql } from "@apollo/client";

export const ADD_EXAMPLE_LISTING = gql`
    mutation exampleListing {
        createListing(
            listingData: {
                title: "example"
                description: "desc"
                startDateTime: "2020-09-24T11:00:00+00:00"
                deadline: "2020-09-24T11:00:00+00:00"
                endDateTime: "2020-09-24T11:00:00+00:00"
                url: "www.google.com"
            }
        ) {
            listing {
                title
                description
                startDateTime
                deadline
                endDateTime
                url
            }
            ok
        }
    }
`;
