import { gql } from "@apollo/client";

export const ADD_LISTING = gql`
    mutation addListing(
        $title: String!
        $description: String!
        $startDateTime: DateTime!
        $deadline: DateTime!
        $endDateTime: DateTime!
        $url: String!
    ) {
        createListing(
            listingData: {
                title: $title
                description: $description
                startDateTime: $startDateTime
                deadline: $deadline
                endDateTime: $endDateTime
                url: $url
            }
        ) {
            listing {
                id
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
