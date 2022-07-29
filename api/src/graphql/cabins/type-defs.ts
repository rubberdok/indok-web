import gql from "graphql-tag";

const typeDefs = gql`
  input NewBookingInput {
    cabinId: ID!
    startDate: DateTime!
    endDate: DateTime!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
  }

  enum Status {
    PENDING
    CONFIRMED
    CANCELLED
    REJECTED
  }

  type Mutation {
    newBooking(data: NewBookingInput!): Booking!
    updateBookingStatus(id: ID!, status: Status!): Booking!
  }

  type Cabin {
    id: ID!
    name: String!
    internalPrice: String!
    externalPrice: String!
  }

  type Booking {
    id: ID!
    endDate: DateTime!
    startDate: DateTime!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    cabin: Cabin!
    status: Status!
  }
`;

export default typeDefs;
