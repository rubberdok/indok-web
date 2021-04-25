import { gql } from "@apollo/client";
import { FORM_RESPONSES_FRAGMENT } from "@graphql/forms/fragments";

export const FORM_RESPONSES = gql`
  ${FORM_RESPONSES_FRAGMENT}
  query Form($formId: ID!) {
    form(formId: $formId) {
      ...FormResponsesFragment
    }
  }
`;
