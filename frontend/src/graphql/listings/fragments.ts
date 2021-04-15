import { gql } from "@apollo/client";
import { FORM_FRAGMENT } from "@graphql/forms/fragments";

export const LISTING_WITH_RESPONDERS_FRAGMENT = gql`
  ${FORM_FRAGMENT}
  fragment ListingWithRespondersFragment on ListingType {
    id
    title
    description
    startDatetime
    deadline
    endDatetime
    url
    form {
      ...FormFragment
    }
  }
`;
