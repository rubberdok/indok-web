import { gql } from "@apollo/client";

export const CACHE_FRAGMENT = gql`
  fragment NewEvent on Event {
    id
    title
    startTime
    endTime
    location
    description
    organization {
      id
      name
    }
    category {
      id
      name
    }
    image
    shortDescription
    contactEmail
    allowedGradeYears

    attendable {
      id
      deadline
      bindingSignup
      price
      signupOpenDate
      slotDistribution {
        gradeGroup
        availableSlots
      }
      hasExtraInformation
      totalAvailableSlots
      isFull
    }
  }
`;
