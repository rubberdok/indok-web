import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
  mutation CreateEvent($eventData: CreateEventInput!) {
    createEvent(eventData: $eventData) {
      event {
        id
        title
        startTime
        endTime
        location
        description
        organization {
          name
        }
        category {
          name
        }
        image
        isAttendable
        deadline
      }
      ok
    }
  }
`;

export const EVENT_SIGN_UP = gql`
  mutation EventSignUp($eventId: ID!, $extraInformation: String) {
    eventSignUp(eventId: $eventId, data: { extraInformation: $extraInformation }) {
      isFull
    }
  }
`;

export const EVENT_SIGN_OFF = gql`
  mutation EventSignOff($eventId: ID!) {
    eventSignOff(eventId: $eventId) {
      isFull
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String) {
    createCategory(categoryData: { name: $name }) {
      category {
        id
        name
      }
      ok
    }
  }
`;

export const SEND_EVENT_EMAILS = gql`
  mutation SendEventMails($eventId: ID!, $receiverEmails: [String], $content: String, $subject: String) {
    sendEventMails(eventId: $eventId, receiverEmails: $receiverEmails, content: $content, subject: $subject) {
      ok
    }
  }
`;
