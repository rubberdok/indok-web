import { graphql } from "@/gql";

export const EventDocument = graphql(`
  query event($id: ID!) {
    event(id: $id) {
      ...EventDetailFields
    }
    user {
      id
      organizations {
        id
      }
    }
  }
`);
