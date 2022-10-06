import {
  AdminEventFragment,
  EventFragment,
  EventInListFragment,
  SignUpFragment,
  SignUpWithTicketFragment,
} from "@/generated/graphql";
import { GraphqlType } from "@/utils/graphql";

export type Event = GraphqlType<EventFragment>;

export type EventInList = GraphqlType<EventInListFragment>;

export type AdminEvent = GraphqlType<AdminEventFragment>;

export type SignUp = GraphqlType<SignUpFragment>;

export type SignUpWithTicket = GraphqlType<SignUpWithTicketFragment>;
