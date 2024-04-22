/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: string; output: string; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
};

export enum AddMemberErrorCode {
  AlreadyMember = 'ALREADY_MEMBER',
  UserNotFound = 'USER_NOT_FOUND'
}

export type AddMemberErrorResponse = {
  __typename?: 'AddMemberErrorResponse';
  code: AddMemberErrorCode;
  message: Scalars['String']['output'];
};

export type AddMemberInput = {
  /** The email of the user ot add to the organization */
  email?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the organization to add the user to */
  organizationId: Scalars['ID']['input'];
  /** The role of the user in the organization, defaults to Role.MEMBER */
  role?: InputMaybe<Role>;
  /** The ID of the user to add to the organization */
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type AddMemberResponse = AddMemberErrorResponse | AddMemberSuccessResponse;

export type AddMemberSuccessResponse = {
  __typename?: 'AddMemberSuccessResponse';
  member: Member;
};

export type Booking = {
  __typename?: 'Booking';
  cabins: Array<Cabin>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  endDate: Scalars['DateTime']['output'];
  /** Feedback from the cabin administrators to the user, e.g. why a booking was rejected */
  feedback: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  guests: Guests;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  /** Questions/comments from the user to the cabin administrators */
  questions: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  status: BookingStatus;
  /** Total cost of the booking, in NOK */
  totalCost: Scalars['Int']['output'];
};

export type BookingContact = {
  __typename?: 'BookingContact';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BookingContactResponse = {
  __typename?: 'BookingContactResponse';
  bookingContact: BookingContact;
};

export type BookingInput = {
  email: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type BookingResponse = {
  __typename?: 'BookingResponse';
  booking?: Maybe<Booking>;
};

export type BookingSemester = {
  __typename?: 'BookingSemester';
  bookingsEnabled: Scalars['Boolean']['output'];
  endAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  semester: Semester;
  startAt: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BookingSemestersResponse = {
  __typename?: 'BookingSemestersResponse';
  fall?: Maybe<BookingSemester>;
  spring?: Maybe<BookingSemester>;
};

export enum BookingStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type BookingTerms = {
  __typename?: 'BookingTerms';
  createdAt: Scalars['DateTime']['output'];
  file: RemoteFile;
  id: Scalars['ID']['output'];
};

export type BookingTermsResponse = {
  __typename?: 'BookingTermsResponse';
  bookingTerms?: Maybe<BookingTerms>;
};

export type BookingsInput = {
  status?: InputMaybe<BookingStatus>;
};

export type BookingsResponse = {
  __typename?: 'BookingsResponse';
  bookings: Array<Booking>;
  total: Scalars['Int']['output'];
};

export type Cabin = {
  __typename?: 'Cabin';
  capacity: Scalars['Int']['output'];
  externalPrice: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  internalPrice: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: CabinPriceGroup;
};

export type CabinInput = {
  id: Scalars['ID']['input'];
};

export type CabinPrice = {
  __typename?: 'CabinPrice';
  weekday: Scalars['Int']['output'];
  weekend: Scalars['Int']['output'];
};

export type CabinPriceGroup = {
  __typename?: 'CabinPriceGroup';
  external: CabinPrice;
  internal: CabinPrice;
};

export type CabinsResponse = {
  __typename?: 'CabinsResponse';
  cabins: Array<Cabin>;
};

export type CalendarDay = {
  __typename?: 'CalendarDay';
  available: Scalars['Boolean']['output'];
  availableForCheckIn: Scalars['Boolean']['output'];
  availableForCheckOut: Scalars['Boolean']['output'];
  bookable: Scalars['Boolean']['output'];
  calendarDate: Scalars['DateTime']['output'];
  price: Scalars['Int']['output'];
};

export type CalendarMonth = {
  __typename?: 'CalendarMonth';
  days: Array<CalendarDay>;
  month: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type CreateCabinInput = {
  capacity: Scalars['Int']['input'];
  externalPrice: Scalars['Int']['input'];
  externalPriceWeekend: Scalars['Int']['input'];
  internalPrice: Scalars['Int']['input'];
  internalPriceWeekend: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type CreateCabinResponse = {
  __typename?: 'CreateCabinResponse';
  cabin: Cabin;
};

export type CreateDocumentInput = {
  categories?: InputMaybe<Array<DocumentCategoryInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  fileExtension: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateDocumentResponse = {
  __typename?: 'CreateDocumentResponse';
  document: Document;
  /** The URL to upload the file to, valid for 10 minutes */
  uploadUrl: Scalars['String']['output'];
};

export type CreateEventCategoryInput = {
  name: Scalars['String']['input'];
};

export type CreateEventCategoryResponse = {
  __typename?: 'CreateEventCategoryResponse';
  category: EventCategory;
};

export type CreateEventInput = {
  event: EventData;
};

export type CreateEventResponse = {
  __typename?: 'CreateEventResponse';
  event: Event;
};

export type CreateEventSlot = {
  capacity: Scalars['Int']['input'];
  gradeYears?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type CreateListingInput = {
  /** An optional URL to the application form for the listing. */
  applicationUrl?: InputMaybe<Scalars['String']['input']>;
  /** At what time the listing will close, will show as a deadline to users, and the listing will be hidden afterwards */
  closesAt: Scalars['DateTime']['input'];
  /** The description of the listing, can be markdown. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The name of the listing, will be visible to users. */
  name: Scalars['String']['input'];
  /** The ID of the organization that the listing belongs to. */
  organizationId: Scalars['ID']['input'];
};

export type CreateListingResponse = {
  __typename?: 'CreateListingResponse';
  listing: Listing;
};

export type CreateMerchantInput = {
  /** Client ID for the merchant, retrieved from the payment provider. */
  clientId: Scalars['String']['input'];
  /** Client secret for the merchant, retrieved from the payment provider. */
  clientSecret: Scalars['String']['input'];
  /** The name of the merchant to create. */
  name: Scalars['String']['input'];
  /** Merchant serial number for the merchant, retrieved from the payment provider. */
  serialNumber: Scalars['String']['input'];
  /** Subscription key for the merchant, retrieved from the payment provider. */
  subscriptionKey: Scalars['String']['input'];
};

export type CreateMerchantResponse = {
  __typename?: 'CreateMerchantResponse';
  /** The merchant that was created. */
  merchant: Merchant;
};

export type CreateOrderInput = {
  /** The ID of the product to create an order for. */
  productId: Scalars['ID']['input'];
};

export type CreateOrderResponse = {
  __typename?: 'CreateOrderResponse';
  order: Order;
};

export type CreateOrganizationInput = {
  /** The description of the organization, cannot exceed 10 000 characters */
  description?: InputMaybe<Scalars['String']['input']>;
  /**
   * Features to enable for the organization. Defaults to an empty list.
   * Requires that the current user is a super user, otherwise, this field is ignored.
   */
  featurePermissions?: InputMaybe<Array<FeaturePermission>>;
  /** The name of the organization, must be unique and between 1 and 100 characters */
  name: Scalars['String']['input'];
};

export type CreateOrganizationResponse = {
  __typename?: 'CreateOrganizationResponse';
  organization: Organization;
};

export type CreateSlotInput = {
  capacity: Scalars['Int']['input'];
  gradeYears?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type DeleteDocumentInput = {
  id: Scalars['ID']['input'];
};

export type DeleteDocumentResponse = {
  __typename?: 'DeleteDocumentResponse';
  document: Document;
};

export type DeleteEventCategoryInput = {
  id: Scalars['ID']['input'];
};

export type DeleteEventCategoryResponse = {
  __typename?: 'DeleteEventCategoryResponse';
  category: EventCategory;
};

export type DeleteListingInput = {
  id: Scalars['ID']['input'];
};

export type DeleteListingResponse = {
  __typename?: 'DeleteListingResponse';
  listing: Listing;
};

export type DeleteSlotInput = {
  id: Scalars['ID']['input'];
};

export type Document = {
  __typename?: 'Document';
  /** The categories the document is in */
  categories: Array<DocumentCategory>;
  /** When the document was created */
  createdAt: Scalars['DateTime']['output'];
  /** The description of the document */
  description: Scalars['String']['output'];
  /** The remote file of the document */
  file: RemoteFile;
  id: Scalars['ID']['output'];
  /** The display name of the document */
  name: Scalars['String']['output'];
  /** When the document was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

export type DocumentCategory = {
  __typename?: 'DocumentCategory';
  /** The ID of the category */
  id: Scalars['ID']['output'];
  /** The name of the category */
  name: Scalars['String']['output'];
};

export type DocumentCategoryInput = {
  name: Scalars['String']['input'];
};

export type DocumentsCategoryInput = {
  id: Scalars['ID']['input'];
};

export type DocumentsInput = {
  categories?: InputMaybe<Array<DocumentsCategoryInput>>;
};

export type DocumentsResponse = {
  __typename?: 'DocumentsResponse';
  documents: Array<Document>;
  total: Scalars['Int']['output'];
};

export type Event = {
  __typename?: 'Event';
  /**
   * canSignUp is true if the current user can sign up for the event, false otherwise.
   * If the user is not logged in, this will be always be false.
   */
  canSignUp: Scalars['Boolean']['output'];
  /** categories describes the categories that the event belongs to. */
  categories?: Maybe<Array<EventCategory>>;
  /** The contact email for the event organizer. */
  contactEmail: Scalars['String']['output'];
  /** The description of the event. We support markdown on the client, so this can be markdown. */
  description: Scalars['String']['output'];
  /** The end time of the event. */
  endAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** The location of the event */
  location: Scalars['String']['output'];
  /** The name of the event. */
  name: Scalars['String']['output'];
  /** The organization that is hosting the event. */
  organization?: Maybe<Organization>;
  /** A short description of the event, intended to be a short summary/teaser of the event. */
  shortDescription: Scalars['String']['output'];
  /** The current user's sign up for the event, if the user is signed up for the event. */
  signUp?: Maybe<SignUp>;
  /** signUpAvailability describes the availability of sign ups for the event for the current user. */
  signUpAvailability: SignUpAvailability;
  signUpDetails?: Maybe<EventSignUpDetails>;
  signUps?: Maybe<SignUps>;
  signUpsEnabled: Scalars['Boolean']['output'];
  /** If true, signing up for the event requires that the user submits additional information. */
  signUpsRequireUserProvidedInformation: Scalars['Boolean']['output'];
  /** If true, sign ups can be retracted for the event. Otherwise, sign ups are final. */
  signUpsRetractable: Scalars['Boolean']['output'];
  /** The start time of the event. */
  startAt: Scalars['DateTime']['output'];
  /** The ticket information for the event, if the event is a TICKETS event. */
  ticketInformation?: Maybe<EventTicketInformation>;
  type: EventType;
  user?: Maybe<EventUser>;
};

export type EventCategoriesResponse = {
  __typename?: 'EventCategoriesResponse';
  categories: Array<EventCategory>;
};

export type EventCategory = {
  __typename?: 'EventCategory';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type EventCategoryInput = {
  id: Scalars['ID']['input'];
};

export type EventData = {
  /** categories is a list of cateogry IDs to which the event belongs */
  categories?: InputMaybe<Array<EventCategoryInput>>;
  /** Contact email for the event organizer */
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  /**
   * The description of the event, defaults to "". We support markdown on the client, so this can be markdown.
   * This will be displayed to users.
   */
  description?: InputMaybe<Scalars['String']['input']>;
  /**
   * The end time of the event. If this is not provided, the event will be assumed to be two hours long.
   * This will be displayed to users.
   */
  endAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Location of the event */
  location?: InputMaybe<Scalars['String']['input']>;
  /** The name of the event, this will be displayed to users */
  name: Scalars['String']['input'];
  /**
   * The ID of the organization that is hosting the event. Events must be hosted by an organization, and the user
   * creating the event must be a member of the organization.
   */
  organizationId: Scalars['ID']['input'];
  /** A short description of the event, intended to be a short summary/teaser of the event. */
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  /** If the event is a sign up event, this will be the sign up details. */
  signUpDetails?: InputMaybe<SignUpData>;
  /**
   * If sign ups are currently enabled for the event. If this is false, users cannot sign up for the event. Defaults to
   * false
   */
  signUpsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** If true, signing up requires that the user submits additional information. Defaults to false */
  signUpsRequireUserProvidedInformation?: InputMaybe<Scalars['Boolean']['input']>;
  /** If true, users can retract their sign up for the event. Defaults to false */
  signUpsRetractable?: InputMaybe<Scalars['Boolean']['input']>;
  /** The start time of the event. Events must have a start time. */
  startAt: Scalars['DateTime']['input'];
  /**
   * The event type
   * - BASIC has no sign ups, and no tickets
   * - SIGN_UPS has sign ups, but no tickets (free event)
   * - TICKETS has tickets and sign ups (paid event)
   */
  type: EventType;
};

export type EventInput = {
  id: Scalars['ID']['input'];
};

export type EventResponse = {
  __typename?: 'EventResponse';
  event: Event;
};

export type EventSignUpDetails = {
  __typename?: 'EventSignUpDetails';
  capacity: Scalars['Int']['output'];
  signUpsEndAt: Scalars['DateTime']['output'];
  signUpsStartAt: Scalars['DateTime']['output'];
};

export type EventTicketData = {
  /** MerchantID is the ID for the merchant, this will be the recipient of the payments. */
  merchantId: Scalars['ID']['input'];
  /** Price in øre, i.e. 100 = 1 NOK */
  price: Scalars['Int']['input'];
};

export type EventTicketInformation = {
  __typename?: 'EventTicketInformation';
  product?: Maybe<Product>;
};

export enum EventTicketStatus {
  Bought = 'BOUGHT',
  NotBought = 'NOT_BOUGHT'
}

export enum EventType {
  /** Basic event has no sign ups, and no tickets */
  Basic = 'BASIC',
  /** Sign up event has sign ups, but no tickets */
  SignUps = 'SIGN_UPS',
  /** Ticketed event has tickets and sign ups */
  Tickets = 'TICKETS'
}

export type EventUser = {
  __typename?: 'EventUser';
  /** The ID of the user */
  id: Scalars['ID']['output'];
  signUp?: Maybe<SignUp>;
  ticket?: Maybe<Order>;
  /** The ticket status for the user on the event, null if it's not a ticket event */
  ticketStatus?: Maybe<EventTicketStatus>;
};

export type EventsCategoryInput = {
  id: Scalars['ID']['input'];
};

export type EventsInput = {
  /** Only return events that belong to the given categories */
  categories?: InputMaybe<Array<EventsCategoryInput>>;
  /** Only return events that end before the given time */
  endBefore?: InputMaybe<Scalars['DateTime']['input']>;
  /**
   * If true, only return events that are currently happening, or will happen in the future
   * i.e. events where endAt is in the future.
   */
  futureEventsOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Only return events that are hosted by the organizations with the given IDs */
  organizations?: InputMaybe<Array<EventsOrganizationInput>>;
  /** Only return events that start after the given time */
  startAfter?: InputMaybe<Scalars['DateTime']['input']>;
};

export type EventsOrganizationInput = {
  id: Scalars['ID']['input'];
};

export type EventsResponse = {
  __typename?: 'EventsResponse';
  /** All events, if futureEventsOnly is false, otherwise only future events */
  events: Array<Event>;
  /** The events that start next week, by week number */
  nextWeek: Array<Event>;
  /** The events that start this week, by week number */
  thisWeek: Array<Event>;
  /** The total number of events returned by this query (for now) */
  total: Scalars['Int']['output'];
  /** The events that start in two weeks or later, by week number */
  twoWeeksOrLater: Array<Event>;
};

export enum FeaturePermission {
  ArchiveViewDocuments = 'ARCHIVE_VIEW_DOCUMENTS',
  ArchiveWriteDocuments = 'ARCHIVE_WRITE_DOCUMENTS',
  CabinAdmin = 'CABIN_ADMIN',
  EventWriteSignUps = 'EVENT_WRITE_SIGN_UPS'
}

export type GetAvailabilityCalendarInput = {
  cabins: Array<CabinInput>;
  count: Scalars['Int']['input'];
  guests: GuestsInput;
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};

export type GetAvailabilityCalendarResponse = {
  __typename?: 'GetAvailabilityCalendarResponse';
  calendarMonths: Array<CalendarMonth>;
};

export type Guests = {
  __typename?: 'Guests';
  external: Scalars['Int']['output'];
  internal: Scalars['Int']['output'];
};

export type GuestsInput = {
  external: Scalars['Int']['input'];
  internal: Scalars['Int']['input'];
};

export type HasFeaturePermissionInput = {
  featurePermission: FeaturePermission;
};

export type HasFeaturePermissionResponse = {
  __typename?: 'HasFeaturePermissionResponse';
  hasFeaturePermission: Scalars['Boolean']['output'];
  id: FeaturePermission;
};

export type HasRoleInput = {
  organizationId: Scalars['ID']['input'];
  role: Role;
};

export type HasRoleResponse = {
  __typename?: 'HasRoleResponse';
  hasRole: Scalars['Boolean']['output'];
};

export type InitiatePaymentAttemptInput = {
  /** The ID of the order to initiate a payment attempt for. */
  orderId: Scalars['ID']['input'];
  /** The return URL to redirect the user to after the payment attempt has been completed. */
  returnUrl: Scalars['String']['input'];
};

export type InitiatePaymentAttemptResponse = {
  __typename?: 'InitiatePaymentAttemptResponse';
  /** The URL to redirect the user to in order to complete the payment. */
  redirectUrl: Scalars['String']['output'];
};

export type Listing = {
  __typename?: 'Listing';
  /** An optional URL to the application form for the listing, defaults to "" */
  applicationUrl: Scalars['String']['output'];
  /** When the listing closes, i.e. deadline, or when the listing is hidden from view. */
  closesAt: Scalars['DateTime']['output'];
  /** The description of the listing, can be markdown. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name/title of the listing, will be visible to users. */
  name: Scalars['String']['output'];
  /** The organization that the listing belongs to. */
  organization: Organization;
};

export type ListingInput = {
  id: Scalars['ID']['input'];
};

export type ListingResponse = {
  __typename?: 'ListingResponse';
  listing: Listing;
};

export type ListingsResponse = {
  __typename?: 'ListingsResponse';
  listings: Array<Listing>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['ID']['output'];
  /** The organization the member is a member of */
  organization: Organization;
  /** The role of the member in the organization */
  role: Role;
  /** The user that is a member of the organization */
  user: PublicUser;
};

export type Merchant = {
  __typename?: 'Merchant';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type MerchantsResponse = {
  __typename?: 'MerchantsResponse';
  merchants: Array<Merchant>;
  total: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a member to the organization */
  addMember: AddMemberResponse;
  /** Create cabin, requires that the user is in an organization with the CABIN_ADMIN permission. */
  createCabin: CreateCabinResponse;
  createDocument: CreateDocumentResponse;
  /** Create an event, requires that the user is logged in, and is a member of the organization that is hosting the event */
  createEvent: CreateEventResponse;
  /** Create a new event category, requires super user status */
  createEventCategory: CreateEventCategoryResponse;
  createListing: CreateListingResponse;
  /**
   * Create a new Vipps merchant, and return the created merchant.
   * Requires super user status.
   */
  createMerchant: CreateMerchantResponse;
  /** Creates an order for the given product. */
  createOrder: CreateOrderResponse;
  /** Create a new organization, and add the current user as an admin of the organization. */
  createOrganization: CreateOrganizationResponse;
  deleteDocument: DeleteDocumentResponse;
  /** Delete an event category, requires super user status */
  deleteEventCategory: DeleteEventCategoryResponse;
  deleteListing: DeleteListingResponse;
  /** Initiates a payment attempt for the given order. */
  initiatePaymentAttempt: InitiatePaymentAttemptResponse;
  newBooking: NewBookingResponse;
  /** Remove a member from the organization by the ID of the membership. */
  removeMember: RemoveMemberResponse;
  /** Remove an active sign up for an event, requires that the user is logged in and a member of the organization that is hosting the event */
  removeSignUp: RemoveSignUpResponse;
  /** Retract an active sign up for an event, requires that the user is logged in */
  retractSignUp: RetractSignUpResponse;
  /** Sign up for an event, requires that the user is logged in */
  signUp: SignUpResponse;
  /**
   * Update the user with the given ID with super user privileges, requires that
   * the caller is an authenticated super user. Otherwise, use updateUser.
   */
  superUpdateUser: SuperUpdateUserResponse;
  /** Updates the booking contact, requires that the user is in an organization with the CABIN_ADMIN permission. */
  updateBookingContact: UpdateBookingContactResponse;
  /**
   * Updates the booking semester for the given semester, requires that the user is in an organization with
   * the CABIN_ADMIN permission.
   */
  updateBookingSemester: UpdateBookingSemesterResponse;
  updateBookingStatus: UpdateBookingResponse;
  /** Update the bookingTerms for cabins, requires that the user is in an organization with the CABIN_ADMIN permission. */
  updateBookingTerms: UpdateBookingTermsResponse;
  /** Updates the cabin with the given ID, requires that the user is in an organization with the CABIN_ADMIN permission. */
  updateCabin: UpdateCabinResponse;
  updateDocument: UpdateDocumentResponse;
  updateEvent: UpdateEventResponse;
  /** Update an event category, requires super user status */
  updateEventCategory: UpdateEventCategoryResponse;
  updateListing: UpdateListingResponse;
  /**
   * Update an organization with the given name and description.
   * Passing null or omitting a value will leave the value unchanged.
   */
  updateOrganization: UpdateOrganizationResponse;
  updateUser: UpdateUserResponse;
  uploadFile: UploadFileResponse;
};


export type MutationAddMemberArgs = {
  data: AddMemberInput;
};


export type MutationCreateCabinArgs = {
  data: CreateCabinInput;
};


export type MutationCreateDocumentArgs = {
  data: CreateDocumentInput;
};


export type MutationCreateEventArgs = {
  data: CreateEventInput;
};


export type MutationCreateEventCategoryArgs = {
  data: CreateEventCategoryInput;
};


export type MutationCreateListingArgs = {
  data: CreateListingInput;
};


export type MutationCreateMerchantArgs = {
  data: CreateMerchantInput;
};


export type MutationCreateOrderArgs = {
  data: CreateOrderInput;
};


export type MutationCreateOrganizationArgs = {
  data: CreateOrganizationInput;
};


export type MutationDeleteDocumentArgs = {
  data: DeleteDocumentInput;
};


export type MutationDeleteEventCategoryArgs = {
  data: DeleteEventCategoryInput;
};


export type MutationDeleteListingArgs = {
  data: DeleteListingInput;
};


export type MutationInitiatePaymentAttemptArgs = {
  data: InitiatePaymentAttemptInput;
};


export type MutationNewBookingArgs = {
  data: NewBookingInput;
};


export type MutationRemoveMemberArgs = {
  data: RemoveMemberInput;
};


export type MutationRemoveSignUpArgs = {
  data: RemoveSignUpInput;
};


export type MutationRetractSignUpArgs = {
  data: RetractSignUpInput;
};


export type MutationSignUpArgs = {
  data: SignUpInput;
};


export type MutationSuperUpdateUserArgs = {
  data: SuperUpdateUserInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateBookingContactArgs = {
  data: UpdateBookingContactInput;
};


export type MutationUpdateBookingSemesterArgs = {
  data: UpdateBookingSemesterInput;
};


export type MutationUpdateBookingStatusArgs = {
  data: UpdateBookingStatusInput;
};


export type MutationUpdateCabinArgs = {
  data: UpdateCabinInput;
};


export type MutationUpdateDocumentArgs = {
  data: UpdateDocumentInput;
};


export type MutationUpdateEventArgs = {
  data: UpdateEventInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateEventCategoryArgs = {
  data: UpdateEventCategoryInput;
};


export type MutationUpdateListingArgs = {
  data: UpdateListingInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateOrganizationArgs = {
  data: UpdateOrganizationInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};


export type MutationUploadFileArgs = {
  data: UploadFileInput;
};

export type NewBookingCabinInput = {
  id: Scalars['ID']['input'];
};

export type NewBookingInput = {
  cabins: Array<NewBookingCabinInput>;
  email: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  externalParticipantsCount: Scalars['Int']['input'];
  firstName: Scalars['String']['input'];
  internalParticipantsCount: Scalars['Int']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  /** Questions/comments from the user to the cabin administrators */
  questions?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['DateTime']['input'];
};

export type NewBookingResponse = {
  __typename?: 'NewBookingResponse';
  booking: Booking;
};

export type Order = {
  __typename?: 'Order';
  /** Number of attempts to pay for the order. */
  attempt: Scalars['Int']['output'];
  capturedPaymentAttempt?: Maybe<PaymentAttempt>;
  /** The date and time the order was created. */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isFinalState: Scalars['Boolean']['output'];
  paymentAttempt?: Maybe<PaymentAttempt>;
  paymentAttempts: PaymentAttemptsResponse;
  /**
   * The current payment status of the order. This is updated asynchronously, so if the payment status is PENDING or CREATED,
   * it is recommended to poll the order to get the current status.
   */
  paymentStatus: OrderPaymentStatus;
  /** The product that the order is for. */
  product: Product;
  purchasedAt?: Maybe<Scalars['DateTime']['output']>;
  totalPrice: Price;
  user?: Maybe<PrivateUser>;
};


export type OrderPaymentAttemptArgs = {
  reference?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderBy {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type OrderInput = {
  id: Scalars['ID']['input'];
};

export enum OrderPaymentStatus {
  /** The order has been cancelled. This is a final state. */
  Cancelled = 'CANCELLED',
  /** The payment attempt has been authorized, but and the payment has been captured. This is a final state. */
  Captured = 'CAPTURED',
  /** The order has been created, and a payment attempt has been made. */
  Created = 'CREATED',
  /** The order has been created, but no payment attempt has been made. */
  Pending = 'PENDING',
  /** The payment attempt has been authorized, but the payment has been refunded. This is a final state. */
  Refunded = 'REFUNDED',
  /** The payment attempt has been authorized, but the payment has been reserved, but not captured. */
  Reserved = 'RESERVED'
}

export type OrderResponse = {
  __typename?: 'OrderResponse';
  order: Order;
};

export type OrdersInput = {
  /** Only get orders for the given product ID. */
  productId?: InputMaybe<Scalars['ID']['input']>;
  /**
   * Only get orders for the given user ID. Requires super user status,
   * or the user ID to match the user ID of the order. Omit to default to
   * the current user.
   */
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type OrdersResponse = {
  __typename?: 'OrdersResponse';
  orders: Array<Order>;
  total: Scalars['Int']['output'];
};

export type Organization = {
  __typename?: 'Organization';
  description: Scalars['String']['output'];
  events: Array<Event>;
  /**
   * The features that are enabled for the organization.
   * Changing these fields requires super user permissions.
   */
  featurePermissions: Array<FeaturePermission>;
  id: Scalars['ID']['output'];
  listings: Array<Listing>;
  logo?: Maybe<RemoteFile>;
  /** The members of the organization */
  members?: Maybe<Array<Member>>;
  name: Scalars['String']['output'];
};

export type OrganizationInput = {
  id: Scalars['ID']['input'];
};

export type OrganizationReseponse = {
  __typename?: 'OrganizationReseponse';
  organization: Organization;
};

export type OrganizationsResponse = {
  __typename?: 'OrganizationsResponse';
  organizations: Array<Organization>;
};

export enum ParticipationStatus {
  /** The user is confirmed to be attending the event */
  Confirmed = 'CONFIRMED',
  /** The user is on the wait list for the event */
  OnWaitlist = 'ON_WAITLIST',
  /** The user has signed up for the event, and had their sign up removed by an admin */
  Removed = 'REMOVED',
  /** The user has signed up for the event, and then retracted their sign up */
  Retracted = 'RETRACTED'
}

export type PaymentAttempt = {
  __typename?: 'PaymentAttempt';
  id: Scalars['ID']['output'];
  isFinalState: Scalars['Boolean']['output'];
  /** The order that the payment attempt is for. */
  order: Order;
  /** The reference for the payment attempt with the payment provider. */
  reference: Scalars['String']['output'];
  /**
   * The current state of the payment attempt. If the payment attempt is CREATED, it is recommended to poll
   * to get the most current state, as it can change asynchronously.
   */
  state: PaymentAttemptState;
};

export enum PaymentAttemptState {
  /** The payment attempt was aborted by the user. This is a final state. */
  Aborted = 'ABORTED',
  /** The payment attempt was successful, and the user has authorized the payment. This is a final state. */
  Authorized = 'AUTHORIZED',
  /** The payment attempt has been started, but not completed. */
  Created = 'CREATED',
  /** The payment attempt expired. This is a final state. */
  Expired = 'EXPIRED',
  /** The payment attempt failed. This is a final state. */
  Failed = 'FAILED',
  /** The payment attempt was terminated (typically by us). This is a final state. */
  Terminated = 'TERMINATED'
}

export type PaymentAttemptsInput = {
  /** Only get payment atttempts for the given order ID. */
  orderId?: InputMaybe<Scalars['ID']['input']>;
  /** Only get payment attempts for the given product ID. */
  productId?: InputMaybe<Scalars['ID']['input']>;
  /**
   * Only get payment attempts for the given user ID. Requires super user status,
   * or the user ID to match the user ID of the payment attempt. Omit to default to
   * the current user.
   */
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type PaymentAttemptsResponse = {
  __typename?: 'PaymentAttemptsResponse';
  paymentAttempts: Array<PaymentAttempt>;
  total: Scalars['Int']['output'];
};

export type Price = {
  __typename?: 'Price';
  /** The unit of the price, e.g. NOK, USD, EUR, etc. */
  unit: Scalars['String']['output'];
  /** The value of the price, in the given unit. */
  value: Scalars['Int']['output'];
  valueInNok: Scalars['Float']['output'];
};

/**
 * PrivateUser should only be used when accessed by the authenticated user themselves
 * as it contains sensitive information.
 */
export type PrivateUser = {
  __typename?: 'PrivateUser';
  allergies?: Maybe<Scalars['String']['output']>;
  /** If the user is permitted to update their graduation year */
  canUpdateYear: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Student email */
  email: Scalars['String']['output'];
  firstLogin: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  /** The users grade year, from 1 - 6(+) */
  gradeYear?: Maybe<Scalars['Int']['output']>;
  /** Expected graduation year for the user */
  graduationYear?: Maybe<Scalars['Int']['output']>;
  /** The last time the users graduation year was updated */
  graduationYearUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  /** true if the user is a super user, false otherwise */
  isSuperUser: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  /** All organizations the user is a member of */
  organizations: Array<Organization>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  /** The users' sign ups */
  signUps: UserSignUps;
  /** The users' study program */
  studyProgram?: Maybe<StudyProgram>;
  username: Scalars['String']['output'];
};


/**
 * PrivateUser should only be used when accessed by the authenticated user themselves
 * as it contains sensitive information.
 */
export type PrivateUserSignUpsArgs = {
  data?: InputMaybe<UserSignUpsInput>;
};

export type Product = {
  __typename?: 'Product';
  /** The description of the product. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The name of the product */
  name: Scalars['String']['output'];
  /** price in øre, i.e. 100 = 1 NOK */
  price: Price;
};

export type ProductResponse = {
  __typename?: 'ProductResponse';
  products: Array<Product>;
  total: Scalars['Int']['output'];
};

/**
 * The public facing user type, with limited information.
 * This type is is available to other users, and should therefore not contain sensitive information,
 * unless the information is restricted by access control.
 */
export type PublicUser = {
  __typename?: 'PublicUser';
  /** The users' given/first name */
  firstName: Scalars['String']['output'];
  /** The users' grade year */
  gradeYear?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  /** The users' family/last name */
  lastName: Scalars['String']['output'];
  /** The users' username */
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  booking: BookingResponse;
  bookingContact: BookingContactResponse;
  bookingSemesters: BookingSemestersResponse;
  bookingTerms: BookingTermsResponse;
  /** Find all bookings, requires that the user is in an organization with the CABIN_ADMIN permission. */
  bookings: BookingsResponse;
  cabins: CabinsResponse;
  categories: EventCategoriesResponse;
  documents: DocumentsResponse;
  event: EventResponse;
  events: EventsResponse;
  getAvailabilityCalendar: GetAvailabilityCalendarResponse;
  hasFeaturePermission: HasFeaturePermissionResponse;
  hasRole: HasRoleResponse;
  listing: ListingResponse;
  listings: ListingsResponse;
  merchants: MerchantsResponse;
  /** Get an order by its ID. */
  order: OrderResponse;
  /**
   * Get orders, filtered by the given input. Unless the user is a super user, only
   * orders for the current user will be returned.
   */
  orders: OrdersResponse;
  /** Get an organization by its ID */
  organization: OrganizationReseponse;
  /** Get all organizations */
  organizations: OrganizationsResponse;
  /**
   * Get payment attempts, filtered by the given input. Unless the user is a super user, only
   * payment attempts for the current user will be returned.
   */
  paymentAttempts: PaymentAttemptsResponse;
  products: ProductResponse;
  serverTime: ServerTimeResponse;
  totalCost: TotalCostResponse;
  user: UserResponse;
  users: UsersResponse;
};


export type QueryBookingArgs = {
  data: BookingInput;
};


export type QueryBookingsArgs = {
  data?: InputMaybe<BookingsInput>;
};


export type QueryDocumentsArgs = {
  data?: InputMaybe<DocumentsInput>;
};


export type QueryEventArgs = {
  data: EventInput;
};


export type QueryEventsArgs = {
  data?: InputMaybe<EventsInput>;
};


export type QueryGetAvailabilityCalendarArgs = {
  data: GetAvailabilityCalendarInput;
};


export type QueryHasFeaturePermissionArgs = {
  data: HasFeaturePermissionInput;
};


export type QueryHasRoleArgs = {
  data: HasRoleInput;
};


export type QueryListingArgs = {
  data: ListingInput;
};


export type QueryOrderArgs = {
  data: OrderInput;
};


export type QueryOrdersArgs = {
  data?: InputMaybe<OrdersInput>;
};


export type QueryOrganizationArgs = {
  data: OrganizationInput;
};


export type QueryPaymentAttemptsArgs = {
  data?: InputMaybe<PaymentAttemptsInput>;
};


export type QueryTotalCostArgs = {
  data: TotalCostInput;
};

export type RemoteFile = {
  __typename?: 'RemoteFile';
  /** The ID of the file */
  id: Scalars['ID']['output'];
  /** The name of the file */
  name: Scalars['String']['output'];
  /** The URL of the file */
  url?: Maybe<Scalars['String']['output']>;
};

export type RemoveMemberInput = {
  id: Scalars['ID']['input'];
};

export type RemoveMemberResponse = {
  __typename?: 'RemoveMemberResponse';
  member: Member;
};

export type RemoveSignUpInput = {
  /** The id of the sign up to remove */
  signUpId: Scalars['ID']['input'];
};

export type RemoveSignUpResponse = {
  __typename?: 'RemoveSignUpResponse';
  /** The sign up that was removed */
  signUp: SignUp;
};

export type RetractSignUpInput = {
  /** The event to retract the sign up for */
  eventId: Scalars['ID']['input'];
};

export type RetractSignUpResponse = {
  __typename?: 'RetractSignUpResponse';
  signUp: SignUp;
};

export enum Role {
  /**
   * An admin of the organization, can do everything a member can,
   * # and can also manage members in the organization and delete the organization.
   */
  Admin = 'ADMIN',
  /**
   * A member of the organization, can do everything except
   * manage members in the organization and delete the organization.
   */
  Member = 'MEMBER'
}

export enum Semester {
  Fall = 'FALL',
  Spring = 'SPRING'
}

export type ServerTimeResponse = {
  __typename?: 'ServerTimeResponse';
  serverTime: Scalars['DateTime']['output'];
};

export type SignUp = {
  __typename?: 'SignUp';
  /**
   * If the user is on the wait list, this field will be set to the approximate position on the wait list.
   * Since the actual position on the wait list depends on which slots the user can attend, and various other
   * factors, this is a naive approximation and should not be relied upon for anything other than a rough estimate.
   */
  approximatePositionOnWaitList?: Maybe<Scalars['Int']['output']>;
  /** The time the user signed up for the event */
  createdAt: Scalars['DateTime']['output'];
  /** The event the user signed up for */
  event: Event;
  id: Scalars['ID']['output'];
  order?: Maybe<Order>;
  /** The status of the user's participation in the event */
  participationStatus: ParticipationStatus;
  /** The user that signed up for the event */
  user: PublicUser;
  userProvidedInformation?: Maybe<Scalars['String']['output']>;
};

export enum SignUpAvailability {
  /** Sign ups are open, enabled, and there is at least one slot available for the user to sign up for. */
  Available = 'AVAILABLE',
  /** The user is not signed up for the event, and sign ups are closed */
  Closed = 'CLOSED',
  Confirmed = 'CONFIRMED',
  /** Sign ups are not enabled for the event */
  Disabled = 'DISABLED',
  /** Sign ups have not opened yet */
  NotOpen = 'NOT_OPEN',
  OnWaitlist = 'ON_WAITLIST',
  /**
   * There are no slots for the event for the user to sign up for, regardless of their current capacity.
   * If the user is not logged in, the status will always be UNAVAILABLE.
   */
  Unavailable = 'UNAVAILABLE',
  /** All slots are full, and the user is not signed up for the event. The user can sign up for the wait list. */
  WaitlistAvailable = 'WAITLIST_AVAILABLE'
}

export type SignUpData = {
  /**
   * Total capacity for the event, regardless of the capacity in each slot.
   * This number takes precedence over the capacity in each slot, so if the remaining capacity on the event is 0
   * no more users can be registered as attending.
   */
  capacity: Scalars['Int']['input'];
  /** The time that sign ups close for the event. This must be after signUpsOpenAt. */
  signUpsEndAt: Scalars['DateTime']['input'];
  /** The time that sign ups open for the event. This must be before the start time of the event. */
  signUpsStartAt: Scalars['DateTime']['input'];
  /** The slots for the event. If this is not provided, but capacity is, then all users can attend the event. */
  slots: Array<CreateEventSlot>;
  /** Ticket purchase details for the event. If this is not provided, then the event is free. */
  tickets?: InputMaybe<EventTicketData>;
};

export type SignUpInput = {
  /** The event to sign up for */
  eventId: Scalars['ID']['input'];
  /** If the event requires user provided information, this field must be set */
  userProvidedInformation?: InputMaybe<Scalars['String']['input']>;
};

export type SignUpResponse = {
  __typename?: 'SignUpResponse';
  signUp: SignUp;
};

export type SignUps = {
  __typename?: 'SignUps';
  confirmed: SignUpsWithTotalCount;
  removed: SignUpsWithTotalCount;
  retracted: SignUpsWithTotalCount;
  waitList: SignUpsWithTotalCount;
};

export type SignUpsWithTotalCount = {
  __typename?: 'SignUpsWithTotalCount';
  signUps: Array<SignUp>;
  total: Scalars['Int']['output'];
};

export type StudyProgram = {
  __typename?: 'StudyProgram';
  externalId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type SuperUpdateUserInput = {
  allergies?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  graduationYear?: InputMaybe<Scalars['Int']['input']>;
  isSuperUser?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type SuperUpdateUserResponse = {
  __typename?: 'SuperUpdateUserResponse';
  user: PrivateUser;
};

export type TotalCostInput = {
  cabins: Array<CabinInput>;
  endDate: Scalars['DateTime']['input'];
  guests: GuestsInput;
  startDate: Scalars['DateTime']['input'];
};

export type TotalCostResponse = {
  __typename?: 'TotalCostResponse';
  totalCost: Scalars['Int']['output'];
};

export type UpdateBookingContactInput = {
  /** The email address of the booking contact, will be publicly available, pass the empty string to remove the email address */
  email?: InputMaybe<Scalars['String']['input']>;
  /** The full name of the booking contact, will be publicly available, pass the empty string to remove the name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The phone number of the booking contact, will be publicly available, pass the empty string to remove the phone number */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBookingContactResponse = {
  __typename?: 'UpdateBookingContactResponse';
  bookingContact: BookingContact;
};

export type UpdateBookingResponse = {
  __typename?: 'UpdateBookingResponse';
  booking: Booking;
};

export type UpdateBookingSemesterInput = {
  /** Whether or not bookings are enabled for this semester */
  bookingsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** The end date for the booking period */
  endAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** There are only ever two semesters, so this is the ID of the semester to update. */
  semester: Semester;
  /** The start date for the booking period */
  startAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateBookingSemesterResponse = {
  __typename?: 'UpdateBookingSemesterResponse';
  bookingSemester: BookingSemester;
};

export type UpdateBookingStatusInput = {
  feedback?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  status: BookingStatus;
};

export type UpdateBookingTermsResponse = {
  __typename?: 'UpdateBookingTermsResponse';
  bookingTerms: BookingTerms;
  uploadUrl: Scalars['String']['output'];
};

export type UpdateCabinInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  externalPrice?: InputMaybe<Scalars['Int']['input']>;
  externalPriceWeekend?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  internalPrice?: InputMaybe<Scalars['Int']['input']>;
  internalPriceWeekend?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCabinResponse = {
  __typename?: 'UpdateCabinResponse';
  cabin: Cabin;
};

export type UpdateCategoriesInput = {
  id: Scalars['ID']['input'];
};

export type UpdateDocumentInput = {
  categories?: InputMaybe<Array<DocumentCategoryInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDocumentResponse = {
  __typename?: 'UpdateDocumentResponse';
  document: Document;
};

export type UpdateEventCategoryInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateEventCategoryResponse = {
  __typename?: 'UpdateEventCategoryResponse';
  category: EventCategory;
};

export type UpdateEventInput = {
  /**
   * Total capacity for the event, regardless of the capacity in each slot.
   * This number takes precedence over the capacity in each slot, so if the remaining capacity on the event is 0
   * no more users can be registered as attending. Cannot be less than the number of users currently signed up for the event.
   */
  capacity?: InputMaybe<Scalars['Int']['input']>;
  /** categories is a list of cateogry IDs to which the event belongs */
  categories?: InputMaybe<Array<UpdateCategoriesInput>>;
  /**
   * The description of the event, defaults to "". We support markdown on the client, so this can be markdown.
   * This will be displayed to users.
   */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The end time of the event, must be after startAt. */
  endAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** location of the event */
  location?: InputMaybe<Scalars['String']['input']>;
  /** The name of the event, this will be displayed to users */
  name?: InputMaybe<Scalars['String']['input']>;
  /** If true, sign ups require user provided information */
  signUpsRequireUserProvidedInformation?: InputMaybe<Scalars['Boolean']['input']>;
  /** If true, sign ups are retractable for the event */
  signUpsRetractable?: InputMaybe<Scalars['Boolean']['input']>;
  slots?: InputMaybe<UpdateSlotsInput>;
  /** The start time of the event. Must be before endAt and after the current time. */
  startAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateEventResponse = {
  __typename?: 'UpdateEventResponse';
  event: Event;
};

export type UpdateListingInput = {
  /** An optional URL to the application form for the listing. */
  applicationUrl?: InputMaybe<Scalars['String']['input']>;
  /** At what time the listing will close, will show as a deadline to users, and the listing will be hidden afterwards */
  closesAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** The description of the listing, can be markdown. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The name of the listing, will be visible to users. */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateListingResponse = {
  __typename?: 'UpdateListingResponse';
  listing: Listing;
};

export type UpdateOrganizationInput = {
  /**
   * The new description of the organization, cannot exceed 10 000 characters
   * Omitting the value or passing null will leave the description unchanged
   */
  description?: InputMaybe<Scalars['String']['input']>;
  /**
   * Features to enable for the organization.
   * Requires that the current user is a super user, otherwise, this field is ignored.
   */
  featurePermissions?: InputMaybe<Array<FeaturePermission>>;
  /** The ID of the organization to update */
  id: Scalars['ID']['input'];
  logoFileId?: InputMaybe<Scalars['ID']['input']>;
  /**
   * The new name of the organization
   * Omitting the value or passing null will leave the name unchanged
   */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationResponse = {
  __typename?: 'UpdateOrganizationResponse';
  organization: Organization;
};

export type UpdateSlotInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  gradeYears?: InputMaybe<Array<Scalars['Int']['input']>>;
  id: Scalars['ID']['input'];
};

export type UpdateSlotsInput = {
  create?: InputMaybe<Array<CreateSlotInput>>;
  delete?: InputMaybe<Array<DeleteSlotInput>>;
  update?: InputMaybe<Array<UpdateSlotInput>>;
};

export type UpdateUserInput = {
  allergies?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  graduationYear?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserResponse = {
  __typename?: 'UpdateUserResponse';
  user: PrivateUser;
};

export type UploadFileInput = {
  extension: Scalars['String']['input'];
};

export type UploadFileResponse = {
  __typename?: 'UploadFileResponse';
  /** The file that was uploaded. */
  file: RemoteFile;
  /**
   * Shared access signature URL for the file upload. For details,
   * see https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview
   */
  sasUrl: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<PrivateUser>;
};

export type UserSignUps = {
  __typename?: 'UserSignUps';
  signUps: Array<SignUp>;
  total: Scalars['Int']['output'];
};

export type UserSignUpsInput = {
  orderBy?: InputMaybe<OrderBy>;
  participationStatus?: InputMaybe<ParticipationStatus>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  super: Array<PrivateUser>;
  total: Scalars['Int']['output'];
  users: Array<PublicUser>;
};

export type AboutUsOrganizationLayoutQueryVariables = Exact<{
  data: OrganizationInput;
}>;


export type AboutUsOrganizationLayoutQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, name: string, description: string, logo?: { __typename?: 'RemoteFile', id: string, url?: string | null } | null } } };

export type AboutUsOrganizationPageQueryVariables = Exact<{
  data: OrganizationInput;
}>;


export type AboutUsOrganizationPageQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, name: string, description: string, logo?: { __typename?: 'RemoteFile', id: string, url?: string | null } | null } } };

export type AboutUsOrganizationsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type AboutUsOrganizationsPageQuery = { __typename?: 'Query', organizations: { __typename?: 'OrganizationsResponse', organizations: Array<{ __typename?: 'Organization', id: string, name: string, logo?: { __typename?: 'RemoteFile', id: string, url?: string | null } | null }> } };

export type BookNow_QueryFragment = { __typename?: 'Query', cabins: { __typename?: 'CabinsResponse', cabins: Array<{ __typename?: 'Cabin', id: string, name: string, internalPrice: number, externalPrice: number }> } } & { ' $fragmentName'?: 'BookNow_QueryFragment' };

export type CabinsInfoSection_QueryFragment = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'BookNow_QueryFragment': BookNow_QueryFragment } }
) & { ' $fragmentName'?: 'CabinsInfoSection_QueryFragment' };

export type ContactCabinBoard_QueryFragment = { __typename?: 'Query', bookingContact: { __typename?: 'BookingContactResponse', bookingContact: { __typename?: 'BookingContact', id: string, name: string, email: string, phoneNumber: string } } } & { ' $fragmentName'?: 'ContactCabinBoard_QueryFragment' };

export type Booking_BookingFragment = { __typename?: 'Booking', lastName: string, id: string, firstName: string, endDate: string, startDate: string, email: string, createdAt: string, phoneNumber: string, status: BookingStatus, totalCost: number, feedback: string, questions: string, cabins: Array<{ __typename?: 'Cabin', id: string, name: string }> } & { ' $fragmentName'?: 'Booking_BookingFragment' };

export type CabinsAdminBookingsPage_BookingsQueryVariables = Exact<{
  data: BookingsInput;
}>;


export type CabinsAdminBookingsPage_BookingsQuery = { __typename?: 'Query', bookings: { __typename?: 'BookingsResponse', total: number, bookings: Array<(
      { __typename?: 'Booking', id: string }
      & { ' $fragmentRefs'?: { 'Booking_BookingFragment': Booking_BookingFragment } }
    )> } };

export type CabinsAdminBookingsPage_UpdateBookingStatusMutationVariables = Exact<{
  data: UpdateBookingStatusInput;
}>;


export type CabinsAdminBookingsPage_UpdateBookingStatusMutation = { __typename?: 'Mutation', updateBookingStatus: { __typename?: 'UpdateBookingResponse', booking: (
      { __typename?: 'Booking', id: string, status: BookingStatus }
      & { ' $fragmentRefs'?: { 'Booking_BookingFragment': Booking_BookingFragment } }
    ) } };

export type CabinsAdminLayout_HasFeaturePermissionQueryVariables = Exact<{
  data: HasFeaturePermissionInput;
}>;


export type CabinsAdminLayout_HasFeaturePermissionQuery = { __typename?: 'Query', hasFeaturePermission: { __typename?: 'HasFeaturePermissionResponse', hasFeaturePermission: boolean } };

export type AdminBookingContact_QueryFragment = { __typename?: 'Query', bookingContact: { __typename?: 'BookingContactResponse', bookingContact: { __typename?: 'BookingContact', id: string, name: string, email: string, phoneNumber: string, updatedAt: string } } } & { ' $fragmentName'?: 'AdminBookingContact_QueryFragment' };

export type BookingContact_UpdateBookingContactMutationVariables = Exact<{
  data: UpdateBookingContactInput;
}>;


export type BookingContact_UpdateBookingContactMutation = { __typename?: 'Mutation', updateBookingContact: { __typename?: 'UpdateBookingContactResponse', bookingContact: { __typename?: 'BookingContact', id: string, name: string, email: string, phoneNumber: string, updatedAt: string } } };

export type BookingSemester_BookingSemesterFragment = { __typename?: 'BookingSemester', id: string, startAt: string, endAt: string, bookingsEnabled: boolean, semester: Semester } & { ' $fragmentName'?: 'BookingSemester_BookingSemesterFragment' };

export type AdminBookingSemesters_QueryFragment = { __typename?: 'Query', bookingSemesters: { __typename?: 'BookingSemestersResponse', spring?: (
      { __typename?: 'BookingSemester' }
      & { ' $fragmentRefs'?: { 'BookingSemester_BookingSemesterFragment': BookingSemester_BookingSemesterFragment } }
    ) | null, fall?: (
      { __typename?: 'BookingSemester' }
      & { ' $fragmentRefs'?: { 'BookingSemester_BookingSemesterFragment': BookingSemester_BookingSemesterFragment } }
    ) | null } } & { ' $fragmentName'?: 'AdminBookingSemesters_QueryFragment' };

export type CabinsAdminSettingsPage_UpdateBookingSemesterMutationMutationVariables = Exact<{
  data: UpdateBookingSemesterInput;
}>;


export type CabinsAdminSettingsPage_UpdateBookingSemesterMutationMutation = { __typename?: 'Mutation', updateBookingSemester: { __typename?: 'UpdateBookingSemesterResponse', bookingSemester: (
      { __typename?: 'BookingSemester' }
      & { ' $fragmentRefs'?: { 'BookingSemester_BookingSemesterFragment': BookingSemester_BookingSemesterFragment } }
    ) } };

export type AdminBookingTerms_QueryFragment = { __typename?: 'Query', bookingTerms: { __typename?: 'BookingTermsResponse', bookingTerms?: (
      { __typename?: 'BookingTerms' }
      & { ' $fragmentRefs'?: { 'BookingTerms_BookingTermsFragment': BookingTerms_BookingTermsFragment } }
    ) | null } } & { ' $fragmentName'?: 'AdminBookingTerms_QueryFragment' };

export type BookingTerms_BookingTermsFragment = { __typename?: 'BookingTerms', id: string, createdAt: string, file: { __typename?: 'RemoteFile', id: string, url?: string | null } } & { ' $fragmentName'?: 'BookingTerms_BookingTermsFragment' };

export type BookingTerms_UpdateBookingTermsMutationVariables = Exact<{ [key: string]: never; }>;


export type BookingTerms_UpdateBookingTermsMutation = { __typename?: 'Mutation', updateBookingTerms: { __typename?: 'UpdateBookingTermsResponse', uploadUrl: string, bookingTerms: (
      { __typename?: 'BookingTerms' }
      & { ' $fragmentRefs'?: { 'BookingTerms_BookingTermsFragment': BookingTerms_BookingTermsFragment } }
    ) } };

export type AdminCabins_QueryFragment = { __typename?: 'Query', cabins: { __typename?: 'CabinsResponse', cabins: Array<(
      { __typename?: 'Cabin', id: string }
      & { ' $fragmentRefs'?: { 'Cabins_CabinFragment': Cabins_CabinFragment } }
    )> } } & { ' $fragmentName'?: 'AdminCabins_QueryFragment' };

export type Cabins_CabinFragment = { __typename?: 'Cabin', id: string, name: string, capacity: number, price: { __typename?: 'CabinPriceGroup', internal: { __typename?: 'CabinPrice', weekend: number, weekday: number }, external: { __typename?: 'CabinPrice', weekend: number, weekday: number } } } & { ' $fragmentName'?: 'Cabins_CabinFragment' };

export type Cabins_CreateCabinMutationVariables = Exact<{
  data: CreateCabinInput;
}>;


export type Cabins_CreateCabinMutation = { __typename?: 'Mutation', createCabin: { __typename?: 'CreateCabinResponse', cabin: (
      { __typename?: 'Cabin' }
      & { ' $fragmentRefs'?: { 'Cabins_CabinFragment': Cabins_CabinFragment } }
    ) } };

export type Cabin_UpdateCabinMutationVariables = Exact<{
  data: UpdateCabinInput;
}>;


export type Cabin_UpdateCabinMutation = { __typename?: 'Mutation', updateCabin: { __typename?: 'UpdateCabinResponse', cabin: (
      { __typename?: 'Cabin' }
      & { ' $fragmentRefs'?: { 'Cabins_CabinFragment': Cabins_CabinFragment } }
    ) } };

export type CabinsAdminSettingsPage_QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinsAdminSettingsPage_QueryQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'AdminCabins_QueryFragment': AdminCabins_QueryFragment;'AdminBookingSemesters_QueryFragment': AdminBookingSemesters_QueryFragment;'AdminBookingContact_QueryFragment': AdminBookingContact_QueryFragment;'AdminBookingTerms_QueryFragment': AdminBookingTerms_QueryFragment } }
);

export type BookingDetails_CabinFragment = { __typename?: 'Cabin', id: string, capacity: number } & { ' $fragmentName'?: 'BookingDetails_CabinFragment' };

export type BookingDetails_TotalCostQueryVariables = Exact<{
  data: TotalCostInput;
}>;


export type BookingDetails_TotalCostQuery = { __typename?: 'Query', totalCost: { __typename?: 'TotalCostResponse', totalCost: number } };

export type BookingTerms_QueryFragment = { __typename?: 'Query', bookingTerms: { __typename?: 'BookingTermsResponse', bookingTerms?: { __typename?: 'BookingTerms', id: string, createdAt: string, file: { __typename?: 'RemoteFile', id: string, url?: string | null } } | null }, bookingContact: { __typename?: 'BookingContactResponse', bookingContact: { __typename?: 'BookingContact', id: string, name: string, email: string, phoneNumber: string } } } & { ' $fragmentName'?: 'BookingTerms_QueryFragment' };

export type PickDates_CabinFragment = { __typename?: 'Cabin', id: string, name: string } & { ' $fragmentName'?: 'PickDates_CabinFragment' };

export type PickDates_CalendarMonthFragment = { __typename?: 'CalendarMonth', month: number, year: number, days: Array<{ __typename?: 'CalendarDay', calendarDate: string, bookable: boolean, available: boolean, availableForCheckIn: boolean, availableForCheckOut: boolean, price: number }> } & { ' $fragmentName'?: 'PickDates_CalendarMonthFragment' };

export type Summary_CabinFragment = { __typename?: 'Cabin', id: string, name: string } & { ' $fragmentName'?: 'Summary_CabinFragment' };

export type CabinsBookPageQueryVariables = Exact<{
  calendarData: GetAvailabilityCalendarInput;
}>;


export type CabinsBookPageQuery = (
  { __typename?: 'Query', cabins: { __typename?: 'CabinsResponse', cabins: Array<(
      { __typename?: 'Cabin', id: string, name: string, capacity: number }
      & { ' $fragmentRefs'?: { 'PickDates_CabinFragment': PickDates_CabinFragment;'BookingDetails_CabinFragment': BookingDetails_CabinFragment;'Summary_CabinFragment': Summary_CabinFragment } }
    )> }, getAvailabilityCalendar: { __typename?: 'GetAvailabilityCalendarResponse', calendarMonths: Array<(
      { __typename?: 'CalendarMonth' }
      & { ' $fragmentRefs'?: { 'PickDates_CalendarMonthFragment': PickDates_CalendarMonthFragment } }
    )> }, user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, firstName: string, lastName: string, phoneNumber?: string | null, email: string } | null } }
  & { ' $fragmentRefs'?: { 'BookingTerms_QueryFragment': BookingTerms_QueryFragment } }
);

export type CabinsBookPage_GetAvailabilityCalendarQueryVariables = Exact<{
  data: GetAvailabilityCalendarInput;
}>;


export type CabinsBookPage_GetAvailabilityCalendarQuery = { __typename?: 'Query', getAvailabilityCalendar: { __typename?: 'GetAvailabilityCalendarResponse', calendarMonths: Array<(
      { __typename?: 'CalendarMonth' }
      & { ' $fragmentRefs'?: { 'PickDates_CalendarMonthFragment': PickDates_CalendarMonthFragment } }
    )> } };

export type CabinsBookPageTotalCostQueryVariables = Exact<{
  data: TotalCostInput;
}>;


export type CabinsBookPageTotalCostQuery = { __typename?: 'Query', totalCost: { __typename?: 'TotalCostResponse', totalCost: number } };

export type CabinsBookPageCreateBookingMutationVariables = Exact<{
  data: NewBookingInput;
}>;


export type CabinsBookPageCreateBookingMutation = { __typename?: 'Mutation', newBooking: { __typename?: 'NewBookingResponse', booking: { __typename?: 'Booking', id: string, startDate: string, endDate: string, firstName: string, lastName: string, email: string, phoneNumber: string, status: BookingStatus, cabins: Array<{ __typename?: 'Cabin', id: string, name: string }> } } };

export type BookingsPage_BookingsQueryVariables = Exact<{
  data: BookingInput;
}>;


export type BookingsPage_BookingsQuery = { __typename?: 'Query', booking: { __typename?: 'BookingResponse', booking?: { __typename?: 'Booking', id: string, startDate: string, endDate: string, firstName: string, lastName: string, totalCost: number, email: string, status: BookingStatus, feedback: string, phoneNumber: string, guests: { __typename?: 'Guests', internal: number, external: number }, cabins: Array<{ __typename?: 'Cabin', id: string, name: string }> } | null } };

export type CabinsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinsPageQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'CabinsInfoSection_QueryFragment': CabinsInfoSection_QueryFragment;'ContactCabinBoard_QueryFragment': ContactCabinBoard_QueryFragment } }
);

export type OrderQueryVariables = Exact<{
  data: OrderInput;
}>;


export type OrderQuery = { __typename?: 'Query', order: { __typename?: 'OrderResponse', order: { __typename?: 'Order', id: string, paymentStatus: OrderPaymentStatus, isFinalState: boolean, product: { __typename?: 'Product', id: string, name: string, description: string }, totalPrice: { __typename?: 'Price', valueInNok: number } } } };

export type InitiatePaymentAttemptMutationVariables = Exact<{
  data: InitiatePaymentAttemptInput;
}>;


export type InitiatePaymentAttemptMutation = { __typename?: 'Mutation', initiatePaymentAttempt: { __typename?: 'InitiatePaymentAttemptResponse', redirectUrl: string } };

export type FileUpload_GetFileUploadUrlMutationVariables = Exact<{
  data: UploadFileInput;
}>;


export type FileUpload_GetFileUploadUrlMutation = { __typename?: 'Mutation', uploadFile: { __typename?: 'UploadFileResponse', sasUrl: string, file: { __typename?: 'RemoteFile', id: string } } };

export type AppLoginButtonUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AppLoginButtonUserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, firstName: string } | null } };

export type AppLoginRequiredUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AppLoginRequiredUserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, firstName: string } | null } };

export type HasFeaturePermissionQueryVariables = Exact<{
  data: HasFeaturePermissionInput;
}>;


export type HasFeaturePermissionQuery = { __typename?: 'Query', hasFeaturePermission: { __typename?: 'HasFeaturePermissionResponse', id: FeaturePermission, hasFeaturePermission: boolean } };

export type DocumentsLayout_HasFeaturePermissionQueryVariables = Exact<{
  data: HasFeaturePermissionInput;
}>;


export type DocumentsLayout_HasFeaturePermissionQuery = { __typename?: 'Query', hasFeaturePermission: { __typename?: 'HasFeaturePermissionResponse', id: FeaturePermission, hasFeaturePermission: boolean } };

export type NewDocumentPage_CreateDocumentMutationVariables = Exact<{
  data: CreateDocumentInput;
}>;


export type NewDocumentPage_CreateDocumentMutation = { __typename?: 'Mutation', createDocument: { __typename?: 'CreateDocumentResponse', uploadUrl: string, document: { __typename?: 'Document', id: string, name: string } } };

export type DocumentsPage_DocumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type DocumentsPage_DocumentsQuery = { __typename?: 'Query', documents: { __typename?: 'DocumentsResponse', documents: Array<{ __typename?: 'Document', id: string, name: string, description: string, categories: Array<{ __typename?: 'DocumentCategory', id: string, name: string }>, file: { __typename?: 'RemoteFile', id: string, url?: string | null } }> } };

export type DropzoneUploadFileMutationVariables = Exact<{
  data: UploadFileInput;
}>;


export type DropzoneUploadFileMutation = { __typename?: 'Mutation', uploadFile: { __typename?: 'UploadFileResponse', sasUrl: string } };

export type EventListItem_EventFragment = { __typename?: 'Event', id: string, name: string, description: string, startAt: string, signUpAvailability: SignUpAvailability, shortDescription: string, signUpDetails?: { __typename?: 'EventSignUpDetails', signUpsStartAt: string } | null } & { ' $fragmentName'?: 'EventListItem_EventFragment' };

export type EventsPageQueryVariables = Exact<{
  data: EventsInput;
}>;


export type EventsPageQuery = (
  { __typename?: 'Query', events: { __typename?: 'EventsResponse', nextWeek: Array<(
      { __typename?: 'Event', id: string }
      & { ' $fragmentRefs'?: { 'EventListItem_EventFragment': EventListItem_EventFragment } }
    )>, thisWeek: Array<(
      { __typename?: 'Event', id: string }
      & { ' $fragmentRefs'?: { 'EventListItem_EventFragment': EventListItem_EventFragment } }
    )>, twoWeeksOrLater: Array<(
      { __typename?: 'Event', id: string }
      & { ' $fragmentRefs'?: { 'EventListItem_EventFragment': EventListItem_EventFragment } }
    )> } }
  & { ' $fragmentRefs'?: { 'FilterMenu_QueryFragment': FilterMenu_QueryFragment } }
);

export type CategoryFilter_QueryFragment = { __typename?: 'Query', categories: { __typename?: 'EventCategoriesResponse', categories: Array<{ __typename?: 'EventCategory', id: string, name: string }> } } & { ' $fragmentName'?: 'CategoryFilter_QueryFragment' };

export type OrganizationFilter_QueryFragment = { __typename?: 'Query', organizationEvents: { __typename?: 'EventsResponse', events: Array<{ __typename?: 'Event', id: string, organization?: { __typename?: 'Organization', id: string, name: string } | null }> } } & { ' $fragmentName'?: 'OrganizationFilter_QueryFragment' };

export type FilterMenu_QueryFragment = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'OrganizationFilter_QueryFragment': OrganizationFilter_QueryFragment;'CategoryFilter_QueryFragment': CategoryFilter_QueryFragment } }
) & { ' $fragmentName'?: 'FilterMenu_QueryFragment' };

export type Action_EventFragmentFragment = { __typename?: 'Event', id: string, signUpAvailability: SignUpAvailability, signUpsRetractable: boolean, signUpsRequireUserProvidedInformation: boolean, signUpDetails?: { __typename?: 'EventSignUpDetails', signUpsStartAt: string, signUpsEndAt: string } | null, signUp?: { __typename?: 'SignUp', id: string, participationStatus: ParticipationStatus, approximatePositionOnWaitList?: number | null } | null } & { ' $fragmentName'?: 'Action_EventFragmentFragment' };

export type EventSignUpMutationVariables = Exact<{
  data: SignUpInput;
}>;


export type EventSignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'SignUpResponse', signUp: { __typename?: 'SignUp', id: string, participationStatus: ParticipationStatus, event: { __typename?: 'Event', id: string, signUpAvailability: SignUpAvailability, user?: { __typename?: 'EventUser', ticket?: { __typename?: 'Order', id: string, paymentStatus: OrderPaymentStatus } | null } | null } } } };

export type EventRetractSignUpMutationVariables = Exact<{
  data: RetractSignUpInput;
}>;


export type EventRetractSignUpMutation = { __typename?: 'Mutation', retractSignUp: { __typename?: 'RetractSignUpResponse', signUp: { __typename?: 'SignUp', id: string, participationStatus: ParticipationStatus, event: { __typename?: 'Event', id: string, signUpAvailability: SignUpAvailability } } } };

export type UseCountdownServerTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type UseCountdownServerTimeQuery = { __typename?: 'Query', serverTime: { __typename?: 'ServerTimeResponse', serverTime: string } };

export type EventSignUp_EventFragmentFragment = (
  { __typename?: 'Event', signUpAvailability: SignUpAvailability, id: string, user?: { __typename?: 'EventUser', id: string, signUp?: { __typename?: 'SignUp', id: string, participationStatus: ParticipationStatus, approximatePositionOnWaitList?: number | null } | null, ticket?: { __typename?: 'Order', id: string, paymentStatus: OrderPaymentStatus } | null } | null, ticketInformation?: { __typename?: 'EventTicketInformation', product?: { __typename?: 'Product', id: string, price: { __typename?: 'Price', valueInNok: number } } | null } | null }
  & { ' $fragmentRefs'?: { 'Action_EventFragmentFragment': Action_EventFragmentFragment } }
) & { ' $fragmentName'?: 'EventSignUp_EventFragmentFragment' };

export type EventLayout_EventFragment = { __typename?: 'Event', id: string, name: string, shortDescription: string, organization?: { __typename?: 'Organization', id: string, name: string } | null } & { ' $fragmentName'?: 'EventLayout_EventFragment' };

export type EventLayout_EventQueryQueryVariables = Exact<{
  data: EventInput;
}>;


export type EventLayout_EventQueryQuery = { __typename?: 'Query', event: { __typename?: 'EventResponse', event: (
      { __typename?: 'Event' }
      & { ' $fragmentRefs'?: { 'EventLayout_EventFragment': EventLayout_EventFragment } }
    ) } };

export type EventPage_EventQueryQueryVariables = Exact<{
  data: EventInput;
}>;


export type EventPage_EventQueryQuery = { __typename?: 'Query', event: { __typename?: 'EventResponse', event: (
      { __typename?: 'Event', id: string, name: string, description: string, signUpsEnabled: boolean, location: string, signUpsRetractable: boolean, endAt: string, startAt: string, contactEmail: string, ticketInformation?: { __typename?: 'EventTicketInformation', product?: { __typename?: 'Product', id: string, price: { __typename?: 'Price', valueInNok: number } } | null } | null, categories?: Array<{ __typename?: 'EventCategory', id: string, name: string }> | null }
      & { ' $fragmentRefs'?: { 'EventSignUp_EventFragmentFragment': EventSignUp_EventFragmentFragment } }
    ) } };

export type SelectMerchant_MerchantFragment = { __typename?: 'Merchant', id: string, name: string } & { ' $fragmentName'?: 'SelectMerchant_MerchantFragment' };

export type TicketEventForm_MerchantFragment = (
  { __typename?: 'Merchant', id: string, name: string }
  & { ' $fragmentRefs'?: { 'SelectMerchant_MerchantFragment': SelectMerchant_MerchantFragment } }
) & { ' $fragmentName'?: 'TicketEventForm_MerchantFragment' };

export type CreateBasicEventPage_QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CreateBasicEventPage_QueryQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, organizations: Array<{ __typename?: 'Organization', id: string, name: string }> } | null }, categories: { __typename?: 'EventCategoriesResponse', categories: Array<{ __typename?: 'EventCategory', id: string, name: string }> } };

export type CreateBasicEventPage_CreateEventMutationVariables = Exact<{
  data: CreateEventInput;
}>;


export type CreateBasicEventPage_CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'CreateEventResponse', event: { __typename?: 'Event', id: string, organization?: { __typename?: 'Organization', id: string } | null } } };

export type CreateSignUpEventPage_CreateEventMutationVariables = Exact<{
  data: CreateEventInput;
}>;


export type CreateSignUpEventPage_CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'CreateEventResponse', event: { __typename?: 'Event', id: string, name: string, organization?: { __typename?: 'Organization', id: string } | null } } };

export type CreateSignUpEventPage_QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CreateSignUpEventPage_QueryQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, organizations: Array<{ __typename?: 'Organization', id: string, name: string }> } | null }, categories: { __typename?: 'EventCategoriesResponse', categories: Array<{ __typename?: 'EventCategory', id: string, name: string }> } };

export type CreateTicketEventPage_CreateEventMutationVariables = Exact<{
  data: CreateEventInput;
}>;


export type CreateTicketEventPage_CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'CreateEventResponse', event: { __typename?: 'Event', id: string, name: string, organization?: { __typename?: 'Organization', id: string } | null } } };

export type CreateTicketEventPage_QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CreateTicketEventPage_QueryQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, organizations: Array<{ __typename?: 'Organization', id: string, name: string }> } | null }, categories: { __typename?: 'EventCategoriesResponse', categories: Array<{ __typename?: 'EventCategory', id: string, name: string }> }, merchants: { __typename?: 'MerchantsResponse', merchants: Array<(
      { __typename?: 'Merchant', id: string, name: string }
      & { ' $fragmentRefs'?: { 'TicketEventForm_MerchantFragment': TicketEventForm_MerchantFragment } }
    )> } };

export type ListingItem_ListingFragment = { __typename?: 'Listing', id: string, name: string, closesAt: string, organization: { __typename?: 'Organization', id: string, name: string, logo?: { __typename?: 'RemoteFile', id: string, url?: string | null } | null } } & { ' $fragmentName'?: 'ListingItem_ListingFragment' };

export type Listings_QueryFragment = { __typename?: 'Query', listings: { __typename?: 'ListingsResponse', listings: Array<(
      { __typename?: 'Listing', id: string }
      & { ' $fragmentRefs'?: { 'ListingItem_ListingFragment': ListingItem_ListingFragment } }
    )> } } & { ' $fragmentName'?: 'Listings_QueryFragment' };

export type ListingsPage_QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ListingsPage_QueryQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'Listings_QueryFragment': Listings_QueryFragment } }
);

export type ListingPage_QueryQueryVariables = Exact<{
  data: ListingInput;
}>;


export type ListingPage_QueryQuery = { __typename?: 'Query', listing: { __typename?: 'ListingResponse', listing: (
      { __typename?: 'Listing', id: string, description: string }
      & { ' $fragmentRefs'?: { 'TitleCard_ListingFragment': TitleCard_ListingFragment } }
    ) } };

export type TitleCard_ListingFragment = { __typename?: 'Listing', name: string, applicationUrl: string, closesAt: string, organization: { __typename?: 'Organization', id: string, name: string } } & { ' $fragmentName'?: 'TitleCard_ListingFragment' };

export type ListingLayout_QueryQueryVariables = Exact<{
  data: ListingInput;
}>;


export type ListingLayout_QueryQuery = { __typename?: 'Query', listing: { __typename?: 'ListingResponse', listing: { __typename?: 'Listing', id: string, name: string, organization: { __typename?: 'Organization', id: string, name: string } } } };

export type ListingMetadataQueryVariables = Exact<{
  data: ListingInput;
}>;


export type ListingMetadataQuery = { __typename?: 'Query', listing: { __typename?: 'ListingResponse', listing: { __typename?: 'Listing', id: string, name: string, description: string } } };

export type NewListing_QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type NewListing_QueryQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, organizations: Array<{ __typename?: 'Organization', id: string, name: string }> } | null } };

export type NewListing_CreateListingMutationMutationVariables = Exact<{
  data: CreateListingInput;
}>;


export type NewListing_CreateListingMutationMutation = { __typename?: 'Mutation', createListing: { __typename?: 'CreateListingResponse', listing: { __typename?: 'Listing', id: string, name: string, description: string, closesAt: string, applicationUrl: string, organization: { __typename?: 'Organization', id: string, name: string } } } };

export type LoginPage_UserQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginPage_UserQueryQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string } | null } };

export type OrganizationsAdminEventsAboutPage_EventQueryQueryVariables = Exact<{
  data: EventInput;
}>;


export type OrganizationsAdminEventsAboutPage_EventQueryQuery = { __typename?: 'Query', event: { __typename?: 'EventResponse', event: { __typename?: 'Event', id: string, name: string, startAt: string, endAt: string, type: EventType, location: string, contactEmail: string, ticketInformation?: { __typename?: 'EventTicketInformation', product?: { __typename?: 'Product', id: string, price: { __typename?: 'Price', valueInNok: number } } | null } | null, organization?: { __typename?: 'Organization', id: string, name: string } | null, signUps?: { __typename?: 'SignUps', confirmed: { __typename?: 'SignUpsWithTotalCount', total: number }, waitList: { __typename?: 'SignUpsWithTotalCount', total: number } } | null } } };

export type EventAdminLayout_EventQueryVariables = Exact<{
  data: EventInput;
}>;


export type EventAdminLayout_EventQuery = { __typename?: 'Query', event: { __typename?: 'EventResponse', event: { __typename?: 'Event', id: string, name: string, organization?: { __typename?: 'Organization', id: string, name: string } | null } } };

export type OrganizationsAdminEventsSignUpsPage_SignUpFragment = { __typename?: 'SignUp', id: string, createdAt: string, userProvidedInformation?: string | null, order?: { __typename?: 'Order', id: string, paymentStatus: OrderPaymentStatus } | null, user: { __typename?: 'PublicUser', id: string, firstName: string, lastName: string, gradeYear?: number | null, username: string } } & { ' $fragmentName'?: 'OrganizationsAdminEventsSignUpsPage_SignUpFragment' };

export type OrganizationsAdminEventsSignUpsPage_EventQueryQueryVariables = Exact<{
  data: EventInput;
}>;


export type OrganizationsAdminEventsSignUpsPage_EventQueryQuery = { __typename?: 'Query', event: { __typename?: 'EventResponse', event: { __typename?: 'Event', id: string, type: EventType, signUpsRequireUserProvidedInformation: boolean, signUps?: { __typename?: 'SignUps', confirmed: { __typename?: 'SignUpsWithTotalCount', total: number, signUps: Array<(
            { __typename?: 'SignUp' }
            & { ' $fragmentRefs'?: { 'OrganizationsAdminEventsSignUpsPage_SignUpFragment': OrganizationsAdminEventsSignUpsPage_SignUpFragment } }
          )> }, waitList: { __typename?: 'SignUpsWithTotalCount', total: number, signUps: Array<(
            { __typename?: 'SignUp' }
            & { ' $fragmentRefs'?: { 'OrganizationsAdminEventsSignUpsPage_SignUpFragment': OrganizationsAdminEventsSignUpsPage_SignUpFragment } }
          )> }, retracted: { __typename?: 'SignUpsWithTotalCount', total: number, signUps: Array<(
            { __typename?: 'SignUp' }
            & { ' $fragmentRefs'?: { 'OrganizationsAdminEventsSignUpsPage_SignUpFragment': OrganizationsAdminEventsSignUpsPage_SignUpFragment } }
          )> }, removed: { __typename?: 'SignUpsWithTotalCount', total: number, signUps: Array<(
            { __typename?: 'SignUp' }
            & { ' $fragmentRefs'?: { 'OrganizationsAdminEventsSignUpsPage_SignUpFragment': OrganizationsAdminEventsSignUpsPage_SignUpFragment } }
          )> } } | null } } };

export type OrganizationsAdminEventsSignUpsPage_RemoveSignUpMutationVariables = Exact<{
  data: RemoveSignUpInput;
}>;


export type OrganizationsAdminEventsSignUpsPage_RemoveSignUpMutation = { __typename?: 'Mutation', removeSignUp: { __typename?: 'RemoveSignUpResponse', signUp: { __typename?: 'SignUp', id: string, participationStatus: ParticipationStatus, user: { __typename?: 'PublicUser', id: string, firstName: string, lastName: string }, event: { __typename?: 'Event', id: string } } } };

export type AdminOrganizationsEventsPageQueryVariables = Exact<{
  data: OrganizationInput;
}>;


export type AdminOrganizationsEventsPageQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, events: Array<{ __typename?: 'Event', type: EventType, id: string, name: string, startAt: string, signUps?: { __typename?: 'SignUps', confirmed: { __typename?: 'SignUpsWithTotalCount', total: number } } | null, signUpDetails?: { __typename?: 'EventSignUpDetails', capacity: number } | null }> } } };

export type OrganizationPageLayoutQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type OrganizationPageLayoutQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, name: string, logo?: { __typename?: 'RemoteFile', id: string, url?: string | null } | null } } };

export type AdminOrganizationsPageListingsQueryVariables = Exact<{
  data: OrganizationInput;
}>;


export type AdminOrganizationsPageListingsQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, listings: Array<{ __typename?: 'Listing', id: string, name: string, closesAt: string }> } } };

export type AddMemberDialog_MemberFragment = { __typename?: 'Member', id: string, role: Role, user: { __typename?: 'PublicUser', id: string, firstName: string, lastName: string }, organization: { __typename?: 'Organization', id: string } } & { ' $fragmentName'?: 'AddMemberDialog_MemberFragment' };

export type OrganizationsAdminMembersPage_AddMemberMutationVariables = Exact<{
  data: AddMemberInput;
}>;


export type OrganizationsAdminMembersPage_AddMemberMutation = { __typename?: 'Mutation', addMember: { __typename?: 'AddMemberErrorResponse', code: AddMemberErrorCode, message: string } | { __typename?: 'AddMemberSuccessResponse', member: (
      { __typename?: 'Member' }
      & { ' $fragmentRefs'?: { 'AddMemberDialog_MemberFragment': AddMemberDialog_MemberFragment } }
    ) } };

export type AdminOrganizationsPageMembersQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type AdminOrganizationsPageMembersQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, members?: Array<{ __typename?: 'Member', id: string, role: Role, user: { __typename?: 'PublicUser', id: string, firstName: string, lastName: string } }> | null } }, user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string } | null }, hasRole: { __typename?: 'HasRoleResponse', hasRole: boolean } };

export type OrganizationsAdminMembersPage_RemoveMemberMutationVariables = Exact<{
  data: RemoveMemberInput;
}>;


export type OrganizationsAdminMembersPage_RemoveMemberMutation = { __typename?: 'Mutation', removeMember: { __typename?: 'RemoveMemberResponse', member: { __typename?: 'Member', id: string } } };

export type OrganizationsAdminEditPage_IsSuperUserQueryVariables = Exact<{
  data: OrganizationInput;
}>;


export type OrganizationsAdminEditPage_IsSuperUserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, isSuperUser: boolean } | null }, organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, name: string, description: string, featurePermissions: Array<FeaturePermission>, logo?: { __typename?: 'RemoteFile', url?: string | null, id: string } | null } } };

export type OrganizationsAdminEditPageMutationVariables = Exact<{
  data: UpdateOrganizationInput;
}>;


export type OrganizationsAdminEditPageMutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'UpdateOrganizationResponse', organization: { __typename?: 'Organization', id: string, name: string, logo?: { __typename?: 'RemoteFile', id: string, url?: string | null } | null } } };

export type OrganizationsAdminEditPageUploadFileMutationVariables = Exact<{
  data: UploadFileInput;
}>;


export type OrganizationsAdminEditPageUploadFileMutation = { __typename?: 'Mutation', uploadFile: { __typename?: 'UploadFileResponse', sasUrl: string, file: { __typename?: 'RemoteFile', id: string } } };

export type OrganizationLayout_OrganizationQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type OrganizationLayout_OrganizationQuery = { __typename?: 'Query', organization: { __typename?: 'OrganizationReseponse', organization: { __typename?: 'Organization', id: string, name: string } }, hasRole: { __typename?: 'HasRoleResponse', hasRole: boolean } };

export type OrganizationAdminLayout_HasRoleQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type OrganizationAdminLayout_HasRoleQuery = { __typename?: 'Query', hasRole: { __typename?: 'HasRoleResponse', hasRole: boolean } };

export type CabinsAdminCard_QueryFragment = { __typename?: 'Query', bookings: { __typename?: 'BookingsResponse', total: number, bookings: Array<{ __typename?: 'Booking', id: string, status: BookingStatus }> } } & { ' $fragmentName'?: 'CabinsAdminCard_QueryFragment' };

export type UserForm_UserFragment = { __typename?: 'PrivateUser', firstName: string, lastName: string, phoneNumber?: string | null, graduationYear?: number | null, allergies?: string | null, graduationYearUpdatedAt?: string | null, canUpdateYear: boolean, gradeYear?: number | null, email: string, studyProgram?: { __typename?: 'StudyProgram', id: string, name: string } | null } & { ' $fragmentName'?: 'UserForm_UserFragment' };

export type ProfileEditPage_UserQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileEditPage_UserQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: (
      { __typename?: 'PrivateUser', id: string }
      & { ' $fragmentRefs'?: { 'UserForm_UserFragment': UserForm_UserFragment } }
    ) | null } };

export type ProfileEditPage_UpdateUserMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type ProfileEditPage_UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserResponse', user: (
      { __typename?: 'PrivateUser', id: string }
      & { ' $fragmentRefs'?: { 'UserForm_UserFragment': UserForm_UserFragment } }
    ) } };

export type OrderStatus_SignUpFragment = { __typename?: 'SignUp', order?: { __typename?: 'Order', id: string, paymentStatus: OrderPaymentStatus, totalPrice: { __typename?: 'Price', valueInNok: number } } | null } & { ' $fragmentName'?: 'OrderStatus_SignUpFragment' };

export type ParticipationStatus_SignUpFragment = { __typename?: 'SignUp', participationStatus: ParticipationStatus, approximatePositionOnWaitList?: number | null } & { ' $fragmentName'?: 'ParticipationStatus_SignUpFragment' };

export type ProfileEventsPageQueryVariables = Exact<{
  data?: InputMaybe<UserSignUpsInput>;
}>;


export type ProfileEventsPageQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, all: { __typename?: 'UserSignUps', total: number }, confirmed: { __typename?: 'UserSignUps', total: number }, onWaitlist: { __typename?: 'UserSignUps', total: number }, retracted: { __typename?: 'UserSignUps', total: number }, removed: { __typename?: 'UserSignUps', total: number }, signUps: { __typename?: 'UserSignUps', signUps: Array<(
          { __typename?: 'SignUp', id: string, createdAt: string, event: { __typename?: 'Event', id: string, name: string, startAt: string, type: EventType } }
          & { ' $fragmentRefs'?: { 'OrderStatus_SignUpFragment': OrderStatus_SignUpFragment;'ParticipationStatus_SignUpFragment': ParticipationStatus_SignUpFragment } }
        )> } } | null } };

export type ProfileLayout_UserQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileLayout_UserQueryQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string } | null } };

export type ProfileOrdersPageQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileOrdersPageQuery = { __typename?: 'Query', orders: { __typename?: 'OrdersResponse', orders: Array<{ __typename?: 'Order', id: string, createdAt: string, purchasedAt?: string | null, paymentStatus: OrderPaymentStatus, isFinalState: boolean, capturedPaymentAttempt?: { __typename?: 'PaymentAttempt', id: string, reference: string, state: PaymentAttemptState } | null, product: { __typename?: 'Product', id: string, name: string }, totalPrice: { __typename?: 'Price', valueInNok: number } }> } };

export type UserOrganizationsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type UserOrganizationsPageQuery = { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, organizations: Array<{ __typename?: 'Organization', id: string, name: string, logo?: { __typename?: 'RemoteFile', id: string, url?: string | null } | null }> } | null } };

export type AppProfileUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AppProfileUserQuery = (
  { __typename?: 'Query', user: { __typename?: 'UserResponse', user?: { __typename?: 'PrivateUser', id: string, firstName: string, lastName: string, gradeYear?: number | null, studyProgram?: { __typename?: 'StudyProgram', id: string, name: string } | null } | null } }
  & { ' $fragmentRefs'?: { 'CabinsAdminCard_QueryFragment': CabinsAdminCard_QueryFragment } }
);

export type AppProfileCabinPermissionQueryVariables = Exact<{ [key: string]: never; }>;


export type AppProfileCabinPermissionQuery = { __typename?: 'Query', hasFeaturePermission: { __typename?: 'HasFeaturePermissionResponse', id: FeaturePermission, hasFeaturePermission: boolean } };

export type ReceiptLayout_OrderQueryVariables = Exact<{
  data: OrderInput;
}>;


export type ReceiptLayout_OrderQuery = { __typename?: 'Query', order: { __typename?: 'OrderResponse', order: { __typename?: 'Order', id: string, product: { __typename?: 'Product', name: string } } } };

export type ReceiptPage_OrderQueryVariables = Exact<{
  data: OrderInput;
  reference?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReceiptPage_OrderQuery = { __typename?: 'Query', order: { __typename?: 'OrderResponse', order: { __typename?: 'Order', id: string, isFinalState: boolean, purchasedAt?: string | null, paymentStatus: OrderPaymentStatus, product: { __typename?: 'Product', id: string, name: string, description: string }, paymentAttempt?: { __typename?: 'PaymentAttempt', id: string, state: PaymentAttemptState, reference: string, isFinalState: boolean } | null, capturedPaymentAttempt?: { __typename?: 'PaymentAttempt', id: string, state: PaymentAttemptState, reference: string } | null, totalPrice: { __typename?: 'Price', value: number, unit: string, valueInNok: number } } } };

export const BookNow_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookNow_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}}]}}]}}]}}]} as unknown as DocumentNode<BookNow_QueryFragment, unknown>;
export const CabinsInfoSection_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CabinsInfoSection_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookNow_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookNow_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsInfoSection_QueryFragment, unknown>;
export const ContactCabinBoard_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContactCabinBoard_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]}}]} as unknown as DocumentNode<ContactCabinBoard_QueryFragment, unknown>;
export const Booking_BookingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Booking_Booking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"questions"}}]}}]} as unknown as DocumentNode<Booking_BookingFragment, unknown>;
export const AdminBookingContact_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBookingContact_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<AdminBookingContact_QueryFragment, unknown>;
export const BookingSemester_BookingSemesterFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester_BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingSemester"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"bookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"semester"}}]}}]} as unknown as DocumentNode<BookingSemester_BookingSemesterFragment, unknown>;
export const AdminBookingSemesters_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBookingSemesters_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingSemesters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spring"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingSemester_BookingSemester"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fall"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingSemester_BookingSemester"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester_BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingSemester"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"bookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"semester"}}]}}]} as unknown as DocumentNode<AdminBookingSemesters_QueryFragment, unknown>;
export const BookingTerms_BookingTermsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingTerms_BookingTerms"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingTerms"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<BookingTerms_BookingTermsFragment, unknown>;
export const AdminBookingTerms_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBookingTerms_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingTerms_BookingTerms"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingTerms_BookingTerms"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingTerms"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<AdminBookingTerms_QueryFragment, unknown>;
export const Cabins_CabinFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabins_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"internal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]} as unknown as DocumentNode<Cabins_CabinFragment, unknown>;
export const AdminCabins_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCabins_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabins_Cabin"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabins_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"internal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]} as unknown as DocumentNode<AdminCabins_QueryFragment, unknown>;
export const BookingDetails_CabinFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingDetails_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]} as unknown as DocumentNode<BookingDetails_CabinFragment, unknown>;
export const BookingTerms_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingTerms_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]}}]} as unknown as DocumentNode<BookingTerms_QueryFragment, unknown>;
export const PickDates_CabinFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PickDates_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<PickDates_CabinFragment, unknown>;
export const PickDates_CalendarMonthFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PickDates_CalendarMonth"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarMonth"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"availableForCheckIn"}},{"kind":"Field","name":{"kind":"Name","value":"availableForCheckOut"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]} as unknown as DocumentNode<PickDates_CalendarMonthFragment, unknown>;
export const Summary_CabinFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Summary_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<Summary_CabinFragment, unknown>;
export const EventListItem_EventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventListItem_Event"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"signUpAvailability"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"signUpDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpsStartAt"}}]}}]}}]} as unknown as DocumentNode<EventListItem_EventFragment, unknown>;
export const OrganizationFilter_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationFilter_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"organizationEvents"},"name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"futureEventsOnly"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationFilter_QueryFragment, unknown>;
export const CategoryFilter_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFilter_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CategoryFilter_QueryFragment, unknown>;
export const FilterMenu_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FilterMenu_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationFilter_Query"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFilter_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationFilter_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"organizationEvents"},"name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"futureEventsOnly"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFilter_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FilterMenu_QueryFragment, unknown>;
export const Action_EventFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Action_EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"signUpDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpsStartAt"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsEndAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signUpAvailability"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsRetractable"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsRequireUserProvidedInformation"}},{"kind":"Field","name":{"kind":"Name","value":"signUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"approximatePositionOnWaitList"}}]}}]}}]} as unknown as DocumentNode<Action_EventFragmentFragment, unknown>;
export const EventSignUp_EventFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSignUp_EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpAvailability"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"signUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"approximatePositionOnWaitList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticketInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Action_EventFragment"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Action_EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"signUpDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpsStartAt"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsEndAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signUpAvailability"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsRetractable"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsRequireUserProvidedInformation"}},{"kind":"Field","name":{"kind":"Name","value":"signUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"approximatePositionOnWaitList"}}]}}]}}]} as unknown as DocumentNode<EventSignUp_EventFragmentFragment, unknown>;
export const EventLayout_EventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventLayout_Event"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<EventLayout_EventFragment, unknown>;
export const SelectMerchant_MerchantFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectMerchant_Merchant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Merchant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<SelectMerchant_MerchantFragment, unknown>;
export const TicketEventForm_MerchantFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketEventForm_Merchant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Merchant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SelectMerchant_Merchant"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectMerchant_Merchant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Merchant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<TicketEventForm_MerchantFragment, unknown>;
export const ListingItem_ListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingItem_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<ListingItem_ListingFragment, unknown>;
export const Listings_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listings_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingItem_Listing"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingItem_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<Listings_QueryFragment, unknown>;
export const TitleCard_ListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TitleCard_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TitleCard_ListingFragment, unknown>;
export const OrganizationsAdminEventsSignUpsPage_SignUpFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userProvidedInformation"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEventsSignUpsPage_SignUpFragment, unknown>;
export const AddMemberDialog_MemberFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddMemberDialog_Member"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<AddMemberDialog_MemberFragment, unknown>;
export const CabinsAdminCard_QueryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CabinsAdminCard_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"EnumValue","value":"PENDING"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsAdminCard_QueryFragment, unknown>;
export const UserForm_UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserForm_User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PrivateUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"studyProgram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserForm_UserFragment, unknown>;
export const OrderStatus_SignUpFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderStatus_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}}]} as unknown as DocumentNode<OrderStatus_SignUpFragment, unknown>;
export const ParticipationStatus_SignUpFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipationStatus_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"approximatePositionOnWaitList"}}]}}]} as unknown as DocumentNode<ParticipationStatus_SignUpFragment, unknown>;
export const AboutUsOrganizationLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AboutUsOrganizationLayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AboutUsOrganizationLayoutQuery, AboutUsOrganizationLayoutQueryVariables>;
export const AboutUsOrganizationPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AboutUsOrganizationPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AboutUsOrganizationPageQuery, AboutUsOrganizationPageQueryVariables>;
export const AboutUsOrganizationsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AboutUsOrganizationsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AboutUsOrganizationsPageQuery, AboutUsOrganizationsPageQueryVariables>;
export const CabinsAdminBookingsPage_BookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsAdminBookingsPage_Bookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Booking_Booking"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Booking_Booking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"questions"}}]}}]} as unknown as DocumentNode<CabinsAdminBookingsPage_BookingsQuery, CabinsAdminBookingsPage_BookingsQueryVariables>;
export const CabinsAdminBookingsPage_UpdateBookingStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CabinsAdminBookingsPage_UpdateBookingStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBookingStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Booking_Booking"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Booking_Booking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Booking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"questions"}}]}}]} as unknown as DocumentNode<CabinsAdminBookingsPage_UpdateBookingStatusMutation, CabinsAdminBookingsPage_UpdateBookingStatusMutationVariables>;
export const CabinsAdminLayout_HasFeaturePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsAdminLayout_HasFeaturePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HasFeaturePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"}}]}}]}}]} as unknown as DocumentNode<CabinsAdminLayout_HasFeaturePermissionQuery, CabinsAdminLayout_HasFeaturePermissionQueryVariables>;
export const BookingContact_UpdateBookingContactDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BookingContact_UpdateBookingContact"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingContactInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBookingContact"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<BookingContact_UpdateBookingContactMutation, BookingContact_UpdateBookingContactMutationVariables>;
export const CabinsAdminSettingsPage_UpdateBookingSemesterMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CabinsAdminSettingsPage_UpdateBookingSemesterMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingSemesterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBookingSemester"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingSemester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingSemester_BookingSemester"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester_BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingSemester"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"bookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"semester"}}]}}]} as unknown as DocumentNode<CabinsAdminSettingsPage_UpdateBookingSemesterMutationMutation, CabinsAdminSettingsPage_UpdateBookingSemesterMutationMutationVariables>;
export const BookingTerms_UpdateBookingTermsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BookingTerms_UpdateBookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingTerms_BookingTerms"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingTerms_BookingTerms"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingTerms"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<BookingTerms_UpdateBookingTermsMutation, BookingTerms_UpdateBookingTermsMutationVariables>;
export const Cabins_CreateCabinDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Cabins_CreateCabin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCabinInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCabin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabins_Cabin"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabins_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"internal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]} as unknown as DocumentNode<Cabins_CreateCabinMutation, Cabins_CreateCabinMutationVariables>;
export const Cabin_UpdateCabinDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Cabin_UpdateCabin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCabinInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCabin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabins_Cabin"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabins_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"internal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]} as unknown as DocumentNode<Cabin_UpdateCabinMutation, Cabin_UpdateCabinMutationVariables>;
export const CabinsAdminSettingsPage_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsAdminSettingsPage_Query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCabins_Query"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminBookingSemesters_Query"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminBookingContact_Query"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminBookingTerms_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabins_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"internal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}},{"kind":"Field","name":{"kind":"Name","value":"external"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekend"}},{"kind":"Field","name":{"kind":"Name","value":"weekday"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester_BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingSemester"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"bookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"semester"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingTerms_BookingTerms"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingTerms"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCabins_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabins_Cabin"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBookingSemesters_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingSemesters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spring"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingSemester_BookingSemester"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fall"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingSemester_BookingSemester"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBookingContact_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBookingTerms_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingTerms_BookingTerms"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsAdminSettingsPage_QueryQuery, CabinsAdminSettingsPage_QueryQueryVariables>;
export const BookingDetails_TotalCostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BookingDetails_TotalCost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TotalCostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCost"}}]}}]}}]} as unknown as DocumentNode<BookingDetails_TotalCostQuery, BookingDetails_TotalCostQueryVariables>;
export const CabinsBookPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsBookPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calendarData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAvailabilityCalendarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PickDates_Cabin"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingDetails_Cabin"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Summary_Cabin"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAvailabilityCalendar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calendarData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarMonths"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PickDates_CalendarMonth"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingTerms_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PickDates_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingDetails_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Summary_Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Cabin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PickDates_CalendarMonth"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarMonth"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"availableForCheckIn"}},{"kind":"Field","name":{"kind":"Name","value":"availableForCheckOut"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingTerms_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsBookPageQuery, CabinsBookPageQueryVariables>;
export const CabinsBookPage_GetAvailabilityCalendarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsBookPage_GetAvailabilityCalendar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAvailabilityCalendarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAvailabilityCalendar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarMonths"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PickDates_CalendarMonth"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PickDates_CalendarMonth"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarMonth"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarDate"}},{"kind":"Field","name":{"kind":"Name","value":"bookable"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"availableForCheckIn"}},{"kind":"Field","name":{"kind":"Name","value":"availableForCheckOut"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]} as unknown as DocumentNode<CabinsBookPage_GetAvailabilityCalendarQuery, CabinsBookPage_GetAvailabilityCalendarQueryVariables>;
export const CabinsBookPageTotalCostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsBookPageTotalCost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TotalCostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCost"}}]}}]}}]} as unknown as DocumentNode<CabinsBookPageTotalCostQuery, CabinsBookPageTotalCostQueryVariables>;
export const CabinsBookPageCreateBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CabinsBookPageCreateBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsBookPageCreateBookingMutation, CabinsBookPageCreateBookingMutationVariables>;
export const BookingsPage_BookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BookingsPage_Bookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"guests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"internal"}},{"kind":"Field","name":{"kind":"Name","value":"external"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BookingsPage_BookingsQuery, BookingsPage_BookingsQueryVariables>;
export const CabinsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CabinsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CabinsInfoSection_Query"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContactCabinBoard_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookNow_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CabinsInfoSection_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookNow_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContactCabinBoard_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]}}]} as unknown as DocumentNode<CabinsPageQuery, CabinsPageQueryVariables>;
export const OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"isFinalState"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrderQuery, OrderQueryVariables>;
export const InitiatePaymentAttemptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"initiatePaymentAttempt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InitiatePaymentAttemptInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initiatePaymentAttempt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redirectUrl"}}]}}]}}]} as unknown as DocumentNode<InitiatePaymentAttemptMutation, InitiatePaymentAttemptMutationVariables>;
export const FileUpload_GetFileUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FileUpload_GetFileUploadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadFileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sasUrl"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<FileUpload_GetFileUploadUrlMutation, FileUpload_GetFileUploadUrlMutationVariables>;
export const AppLoginButtonUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppLoginButtonUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<AppLoginButtonUserQuery, AppLoginButtonUserQueryVariables>;
export const AppLoginRequiredUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppLoginRequiredUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<AppLoginRequiredUserQuery, AppLoginRequiredUserQueryVariables>;
export const HasFeaturePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HasFeaturePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HasFeaturePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"}}]}}]}}]} as unknown as DocumentNode<HasFeaturePermissionQuery, HasFeaturePermissionQueryVariables>;
export const DocumentsLayout_HasFeaturePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentsLayout_HasFeaturePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HasFeaturePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"}}]}}]}}]} as unknown as DocumentNode<DocumentsLayout_HasFeaturePermissionQuery, DocumentsLayout_HasFeaturePermissionQueryVariables>;
export const NewDocumentPage_CreateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NewDocumentPage_CreateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}}]}}]}}]} as unknown as DocumentNode<NewDocumentPage_CreateDocumentMutation, NewDocumentPage_CreateDocumentMutationVariables>;
export const DocumentsPage_DocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentsPage_Documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DocumentsPage_DocumentsQuery, DocumentsPage_DocumentsQueryVariables>;
export const DropzoneUploadFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DropzoneUploadFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadFileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sasUrl"}}]}}]}}]} as unknown as DocumentNode<DropzoneUploadFileMutation, DropzoneUploadFileMutationVariables>;
export const EventsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nextWeek"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventListItem_Event"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thisWeek"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventListItem_Event"}}]}},{"kind":"Field","name":{"kind":"Name","value":"twoWeeksOrLater"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventListItem_Event"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FilterMenu_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationFilter_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"organizationEvents"},"name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"futureEventsOnly"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFilter_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventListItem_Event"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"signUpAvailability"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"signUpDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpsStartAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FilterMenu_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationFilter_Query"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFilter_Query"}}]}}]} as unknown as DocumentNode<EventsPageQuery, EventsPageQueryVariables>;
export const EventSignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EventSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"signUpAvailability"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventSignUpMutation, EventSignUpMutationVariables>;
export const EventRetractSignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EventRetractSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RetractSignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"retractSignUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"signUpAvailability"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventRetractSignUpMutation, EventRetractSignUpMutationVariables>;
export const UseCountdownServerTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseCountdownServerTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverTime"}}]}}]}}]} as unknown as DocumentNode<UseCountdownServerTimeQuery, UseCountdownServerTimeQueryVariables>;
export const EventLayout_EventQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventLayout_EventQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventLayout_Event"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventLayout_Event"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<EventLayout_EventQueryQuery, EventLayout_EventQueryQueryVariables>;
export const EventPage_EventQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventPage_EventQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsRetractable"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"ticketInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSignUp_EventFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Action_EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"signUpDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpsStartAt"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsEndAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signUpAvailability"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsRetractable"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsRequireUserProvidedInformation"}},{"kind":"Field","name":{"kind":"Name","value":"signUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"approximatePositionOnWaitList"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSignUp_EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUpAvailability"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"signUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"approximatePositionOnWaitList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticketInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Action_EventFragment"}}]}}]} as unknown as DocumentNode<EventPage_EventQueryQuery, EventPage_EventQueryQueryVariables>;
export const CreateBasicEventPage_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreateBasicEventPage_Query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBasicEventPage_QueryQuery, CreateBasicEventPage_QueryQueryVariables>;
export const CreateBasicEventPage_CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBasicEventPage_CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateBasicEventPage_CreateEventMutation, CreateBasicEventPage_CreateEventMutationVariables>;
export const CreateSignUpEventPage_CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSignUpEventPage_CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateSignUpEventPage_CreateEventMutation, CreateSignUpEventPage_CreateEventMutationVariables>;
export const CreateSignUpEventPage_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreateSignUpEventPage_Query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSignUpEventPage_QueryQuery, CreateSignUpEventPage_QueryQueryVariables>;
export const CreateTicketEventPage_CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTicketEventPage_CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateTicketEventPage_CreateEventMutation, CreateTicketEventPage_CreateEventMutationVariables>;
export const CreateTicketEventPage_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreateTicketEventPage_Query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"merchants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketEventForm_Merchant"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectMerchant_Merchant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Merchant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketEventForm_Merchant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Merchant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SelectMerchant_Merchant"}}]}}]} as unknown as DocumentNode<CreateTicketEventPage_QueryQuery, CreateTicketEventPage_QueryQueryVariables>;
export const ListingsPage_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingsPage_Query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listings_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingItem_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listings_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingItem_Listing"}}]}}]}}]}}]} as unknown as DocumentNode<ListingsPage_QueryQuery, ListingsPage_QueryQueryVariables>;
export const ListingPage_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingPage_Query"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TitleCard_Listing"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TitleCard_Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Listing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ListingPage_QueryQuery, ListingPage_QueryQueryVariables>;
export const ListingLayout_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingLayout_Query"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListingLayout_QueryQuery, ListingLayout_QueryQueryVariables>;
export const ListingMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListingMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ListingMetadataQuery, ListingMetadataQueryVariables>;
export const NewListing_QueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NewListing_Query"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<NewListing_QueryQuery, NewListing_QueryQueryVariables>;
export const NewListing_CreateListingMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NewListing_CreateListingMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}}]}}]}}]}}]} as unknown as DocumentNode<NewListing_CreateListingMutationMutation, NewListing_CreateListingMutationMutationVariables>;
export const LoginPage_UserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoginPage_UserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<LoginPage_UserQueryQuery, LoginPage_UserQueryQueryVariables>;
export const OrganizationsAdminEventsAboutPage_EventQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationsAdminEventsAboutPage_EventQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"ticketInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"waitList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEventsAboutPage_EventQueryQuery, OrganizationsAdminEventsAboutPage_EventQueryQueryVariables>;
export const EventAdminLayout_EventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventAdminLayout_Event"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventAdminLayout_EventQuery, EventAdminLayout_EventQueryVariables>;
export const OrganizationsAdminEventsSignUpsPage_EventQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_EventQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"signUpsRequireUserProvidedInformation"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"waitList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"retracted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"removed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userProvidedInformation"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEventsSignUpsPage_EventQueryQuery, OrganizationsAdminEventsSignUpsPage_EventQueryQueryVariables>;
export const OrganizationsAdminEventsSignUpsPage_RemoveSignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrganizationsAdminEventsSignUpsPage_RemoveSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveSignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeSignUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEventsSignUpsPage_RemoveSignUpMutation, OrganizationsAdminEventsSignUpsPage_RemoveSignUpMutationVariables>;
export const AdminOrganizationsEventsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminOrganizationsEventsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"signUpDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminOrganizationsEventsPageQuery, AdminOrganizationsEventsPageQueryVariables>;
export const OrganizationPageLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationPageLayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationPageLayoutQuery, OrganizationPageLayoutQueryVariables>;
export const AdminOrganizationsPageListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminOrganizationsPageListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closesAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminOrganizationsPageListingsQuery, AdminOrganizationsPageListingsQueryVariables>;
export const OrganizationsAdminMembersPage_AddMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrganizationsAdminMembersPage_AddMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AddMemberSuccessResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AddMemberDialog_Member"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AddMemberErrorResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddMemberDialog_Member"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]} as unknown as DocumentNode<OrganizationsAdminMembersPage_AddMemberMutation, OrganizationsAdminMembersPage_AddMemberMutationVariables>;
export const AdminOrganizationsPageMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminOrganizationsPageMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"EnumValue","value":"ADMIN"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRole"}}]}}]}}]} as unknown as DocumentNode<AdminOrganizationsPageMembersQuery, AdminOrganizationsPageMembersQueryVariables>;
export const OrganizationsAdminMembersPage_RemoveMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrganizationsAdminMembersPage_RemoveMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminMembersPage_RemoveMemberMutation, OrganizationsAdminMembersPage_RemoveMemberMutationVariables>;
export const OrganizationsAdminEditPage_IsSuperUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationsAdminEditPage_IsSuperUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isSuperUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"featurePermissions"}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEditPage_IsSuperUserQuery, OrganizationsAdminEditPage_IsSuperUserQueryVariables>;
export const OrganizationsAdminEditPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrganizationsAdminEditPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEditPageMutation, OrganizationsAdminEditPageMutationVariables>;
export const OrganizationsAdminEditPageUploadFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrganizationsAdminEditPageUploadFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadFileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sasUrl"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationsAdminEditPageUploadFileMutation, OrganizationsAdminEditPageUploadFileMutationVariables>;
export const OrganizationLayout_OrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationLayout_Organization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"EnumValue","value":"MEMBER"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRole"}}]}}]}}]} as unknown as DocumentNode<OrganizationLayout_OrganizationQuery, OrganizationLayout_OrganizationQueryVariables>;
export const OrganizationAdminLayout_HasRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationAdminLayout_HasRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"role"},"value":{"kind":"EnumValue","value":"MEMBER"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasRole"}}]}}]}}]} as unknown as DocumentNode<OrganizationAdminLayout_HasRoleQuery, OrganizationAdminLayout_HasRoleQueryVariables>;
export const ProfileEditPage_UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileEditPage_User"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserForm_User"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserForm_User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PrivateUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"studyProgram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ProfileEditPage_UserQuery, ProfileEditPage_UserQueryVariables>;
export const ProfileEditPage_UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ProfileEditPage_UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserForm_User"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserForm_User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PrivateUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"studyProgram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ProfileEditPage_UpdateUserMutation, ProfileEditPage_UpdateUserMutationVariables>;
export const ProfileEventsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileEventsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserSignUpsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"all"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"confirmed"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"EnumValue","value":"CONFIRMED"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"onWaitlist"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"EnumValue","value":"ON_WAITLIST"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"retracted"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"EnumValue","value":"RETRACTED"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"removed"},"name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"participationStatus"},"value":{"kind":"EnumValue","value":"REMOVED"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signUps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderStatus_SignUp"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ParticipationStatus_SignUp"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderStatus_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ParticipationStatus_SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUp"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"approximatePositionOnWaitList"}}]}}]} as unknown as DocumentNode<ProfileEventsPageQuery, ProfileEventsPageQueryVariables>;
export const ProfileLayout_UserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileLayout_UserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileLayout_UserQueryQuery, ProfileLayout_UserQueryQueryVariables>;
export const ProfileOrdersPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileOrdersPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"capturedPaymentAttempt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}},{"kind":"Field","name":{"kind":"Name","value":"purchasedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"isFinalState"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileOrdersPageQuery, ProfileOrdersPageQueryVariables>;
export const UserOrganizationsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserOrganizationsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserOrganizationsPageQuery, UserOrganizationsPageQueryVariables>;
export const AppProfileUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppProfileUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"studyProgram"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CabinsAdminCard_Query"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CabinsAdminCard_Query"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"EnumValue","value":"PENDING"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<AppProfileUserQuery, AppProfileUserQueryVariables>;
export const AppProfileCabinPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppProfileCabinPermission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"featurePermission"},"value":{"kind":"EnumValue","value":"CABIN_ADMIN"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasFeaturePermission"}}]}}]}}]} as unknown as DocumentNode<AppProfileCabinPermissionQuery, AppProfileCabinPermissionQueryVariables>;
export const ReceiptLayout_OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReceiptLayout_Order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReceiptLayout_OrderQuery, ReceiptLayout_OrderQueryVariables>;
export const ReceiptPage_OrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReceiptPage_Order"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reference"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isFinalState"}},{"kind":"Field","name":{"kind":"Name","value":"purchasedAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentAttempt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reference"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reference"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"isFinalState"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capturedPaymentAttempt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"valueInNok"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReceiptPage_OrderQuery, ReceiptPage_OrderQueryVariables>;