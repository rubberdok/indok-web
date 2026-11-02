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
  Date: { input: string; output: string; }
  DateTime: { input: string; output: string; }
  Decimal: { input: number; output: number; }
  UUID: { input: string; output: string; }
};

export type AddMembershipByIdentifier = {
  __typename?: 'AddMembershipByIdentifier';
  ok: Scalars['Boolean']['output'];
};

/** Booking type for admin users */
export type AdminBookingType = {
  __typename?: 'AdminBookingType';
  cabins: Array<CabinType>;
  checkIn: Scalars['Date']['output'];
  checkOut: Scalars['Date']['output'];
  declineReason: Scalars['String']['output'];
  externalParticipants: Scalars['Int']['output'];
  extraInfo: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  internalParticipants: Scalars['Int']['output'];
  isDeclined: Scalars['Boolean']['output'];
  isInternalPrice?: Maybe<Scalars['Int']['output']>;
  isTentative: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  numberOfNights?: Maybe<Scalars['Int']['output']>;
  phone: Scalars['String']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  receiverEmail: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

/**
 * Sets the field is_attending to False in the Sign Up for the user with the
 * given ID, for the event with the given ID
 * NOTE: The sign up still exists, it is not deleted from the database
 *       when a user signs off an event
 */
export type AdminEventSignOff = {
  __typename?: 'AdminEventSignOff';
  event?: Maybe<EventType>;
};

export type AdminUpdateUser = {
  __typename?: 'AdminUpdateUser';
  user?: Maybe<UserType>;
};

export type AdminUpdateUserNfc = {
  __typename?: 'AdminUpdateUserNfc';
  user?: Maybe<UserType>;
};

export type AdminUserInput = {
  allergies?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  graduationYear?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type AdminUserNfcInput = {
  mifareCsn?: InputMaybe<Scalars['String']['input']>;
  /** Begrunnelse for permanent tilgang. */
  note?: InputMaybe<Scalars['String']['input']>;
  permanentAccess?: InputMaybe<Scalars['Boolean']['input']>;
  pinCode?: InputMaybe<Scalars['String']['input']>;
};

/** Booking type for fields available for not logged in users */
export type AllBookingsType = {
  __typename?: 'AllBookingsType';
  cabins: Array<CabinType>;
  checkIn: Scalars['Date']['output'];
  checkOut: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
};

export type AnswerInput = {
  answer: Scalars['String']['input'];
  questionId: Scalars['ID']['input'];
};

/** A user's answer to a question. */
export type AnswerType = {
  __typename?: 'AnswerType';
  answer: Scalars['String']['output'];
  id?: Maybe<Scalars['UUID']['output']>;
  question: QuestionType;
  uuid: Scalars['UUID']['output'];
};

/** An enumeration. */
export enum ArchiveArchiveDocumentTypeDocChoices {
  /** Annet */
  Annet = 'ANNET',
  /** Årbøker */
  Arboker = 'ARBOKER',
  /** Budsjett og Regnskap */
  BudsjettOgRegnskap = 'BUDSJETT_OG_REGNSKAP',
  /** Foreningens lover */
  ForeningensLover = 'FORENINGENS_LOVER',
  /** Generalforsamling */
  Generalforsamling = 'GENERALFORSAMLING',
  /** Januscript */
  Januscript = 'JANUSCRIPT',
  /** Støtte fra HS */
  StotteFraHs = 'STOTTE_FRA_HS',
  /** Utveksling */
  Utveksling = 'UTVEKSLING'
}

export type ArchiveDocumentType = {
  __typename?: 'ArchiveDocumentType';
  featured: Scalars['Boolean']['output'];
  fileLocation: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  typeDoc: ArchiveArchiveDocumentTypeDocChoices;
  webLink?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type AssignMembership = {
  __typename?: 'AssignMembership';
  membership?: Maybe<MembershipType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type AttemptCapturePayment = {
  __typename?: 'AttemptCapturePayment';
  order?: Maybe<OrderType>;
  status?: Maybe<PaymentStatus>;
};

export type AuthUser = {
  __typename?: 'AuthUser';
  user: UserType;
};

export type BaseFormInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};

export type BaseListingInput = {
  application?: InputMaybe<Scalars['Boolean']['input']>;
  applicationUrl?: InputMaybe<Scalars['String']['input']>;
  case?: InputMaybe<Scalars['Boolean']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  formId?: InputMaybe<Scalars['ID']['input']>;
  interview?: InputMaybe<Scalars['Boolean']['input']>;
  readMoreUrl?: InputMaybe<Scalars['String']['input']>;
  startDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type BaseQuestionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  mandatory?: InputMaybe<Scalars['Boolean']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
  questionType?: InputMaybe<QuestionTypeEnum>;
};

export type BlogPostType = {
  __typename?: 'BlogPostType';
  author?: Maybe<UserType>;
  blog?: Maybe<BlogType>;
  id: Scalars['ID']['output'];
  publishDate: Scalars['DateTime']['output'];
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type BlogType = {
  __typename?: 'BlogType';
  blogPosts: Array<BlogPostType>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization?: Maybe<OrganizationType>;
};

/** Basic booking object type used as a base for other types and as a standalone */
export type BookingInput = {
  cabins?: InputMaybe<Array<Scalars['Int']['input']>>;
  checkIn?: InputMaybe<Scalars['Date']['input']>;
  checkOut?: InputMaybe<Scalars['Date']['input']>;
  externalParticipants?: InputMaybe<Scalars['Int']['input']>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  internalParticipants?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  receiverEmail?: InputMaybe<Scalars['String']['input']>;
};

export type BookingResponsibleType = {
  __typename?: 'BookingResponsibleType';
  active?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['Int']['output']>;
};

export type CabinType = {
  __typename?: 'CabinType';
  externalPrice: Scalars['Int']['output'];
  externalPriceWeekend: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  internalPrice: Scalars['Int']['output'];
  internalPriceWeekend: Scalars['Int']['output'];
  maxGuests: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryType = {
  __typename?: 'CategoryType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateArchiveDocument = {
  __typename?: 'CreateArchiveDocument';
  arhiveDocument?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateBlog = {
  __typename?: 'CreateBlog';
  blog?: Maybe<BlogType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateBlogPost = {
  __typename?: 'CreateBlogPost';
  blogPost?: Maybe<BlogPostType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Add a new booking to the database */
export type CreateBooking = {
  __typename?: 'CreateBooking';
  booking?: Maybe<AllBookingsType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Create a new event category */
export type CreateCategory = {
  __typename?: 'CreateCategory';
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Create a new event */
export type CreateEvent = {
  __typename?: 'CreateEvent';
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateEventInput = {
  allowedGradeYears?: InputMaybe<Array<Scalars['Int']['input']>>;
  availableSlots?: InputMaybe<Scalars['Int']['input']>;
  bindingSignup?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description: Scalars['String']['input'];
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  hasExtraInformation?: InputMaybe<Scalars['Boolean']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isAttendable: Scalars['Boolean']['input'];
  isHidden?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  signupOpenDate?: InputMaybe<Scalars['DateTime']['input']>;
  startTime: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
};

export type CreateForm = {
  __typename?: 'CreateForm';
  form?: Maybe<FormType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateFormInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
};

export type CreateJanHusBooking = {
  __typename?: 'CreateJanHusBooking';
  booking?: Maybe<JanHusBookingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  /** Existing bookings this booking overlaps. Non-empty when an admin has deliberately double-booked. */
  overlappingBookings?: Maybe<Array<JanHusBookingType>>;
};

export type CreateJanHusBookingRequest = {
  __typename?: 'CreateJanHusBookingRequest';
  bookingRequest?: Maybe<JanHusBookingRequestType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateJanHusPaymentProduct = {
  __typename?: 'CreateJanHusPaymentProduct';
  booking?: Maybe<JanHusBookingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  productId?: Maybe<Scalars['ID']['output']>;
};

/** Creates a new listing */
export type CreateListing = {
  __typename?: 'CreateListing';
  listing?: Maybe<ListingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateListingInput = {
  application?: InputMaybe<Scalars['Boolean']['input']>;
  applicationUrl?: InputMaybe<Scalars['String']['input']>;
  case?: InputMaybe<Scalars['Boolean']['input']>;
  deadline: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  formId?: InputMaybe<Scalars['ID']['input']>;
  interview?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId: Scalars['ID']['input'];
  readMoreUrl?: InputMaybe<Scalars['String']['input']>;
  startDatetime?: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
};

export type CreateOrganization = {
  __typename?: 'CreateOrganization';
  ok?: Maybe<Scalars['Boolean']['output']>;
  organization?: Maybe<OrganizationType>;
};

export type CreateProduct = {
  __typename?: 'CreateProduct';
  ok?: Maybe<Scalars['Boolean']['output']>;
  product?: Maybe<ProductType>;
};

export type CreateProductInput = {
  description: Scalars['String']['input'];
  maxBuyableQuantity: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  price: Scalars['Decimal']['input'];
  totalQuantity: Scalars['Int']['input'];
};

export type CreateQuestion = {
  __typename?: 'CreateQuestion';
  ok?: Maybe<Scalars['Boolean']['output']>;
  question?: Maybe<QuestionType>;
};

export type CreateQuestionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  mandatory?: InputMaybe<Scalars['Boolean']['input']>;
  question: Scalars['String']['input'];
  questionType?: InputMaybe<QuestionTypeEnum>;
};

export type CreateUpdateAndDeleteOptions = {
  __typename?: 'CreateUpdateAndDeleteOptions';
  ok?: Maybe<Scalars['Boolean']['output']>;
  options?: Maybe<Array<OptionType>>;
};

export type DeleteAnswer = {
  __typename?: 'DeleteAnswer';
  deletedUuid?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteAnswersToForm = {
  __typename?: 'DeleteAnswersToForm';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteArchiveDocument = {
  __typename?: 'DeleteArchiveDocument';
  archiveDocument?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteBlog = {
  __typename?: 'DeleteBlog';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteBlogPost = {
  __typename?: 'DeleteBlogPost';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the booking with the given ID */
export type DeleteBooking = {
  __typename?: 'DeleteBooking';
  bookingId?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the category with a given ID */
export type DeleteCategory = {
  __typename?: 'DeleteCategory';
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the event with the given ID */
export type DeleteEvent = {
  __typename?: 'DeleteEvent';
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteForm = {
  __typename?: 'DeleteForm';
  deletedId?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteJanHusArea = {
  __typename?: 'DeleteJanHusArea';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteJanHusBooking = {
  __typename?: 'DeleteJanHusBooking';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteJanHusBookingRequest = {
  __typename?: 'DeleteJanHusBookingRequest';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Deletes the listing with the given ID */
export type DeleteListing = {
  __typename?: 'DeleteListing';
  listingId?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteOrganization = {
  __typename?: 'DeleteOrganization';
  ok?: Maybe<Scalars['Boolean']['output']>;
  organization?: Maybe<OrganizationType>;
};

export type DeleteQuestion = {
  __typename?: 'DeleteQuestion';
  deletedId?: Maybe<Scalars['ID']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type DeliveredProduct = {
  __typename?: 'DeliveredProduct';
  ok?: Maybe<Scalars['Boolean']['output']>;
  order?: Maybe<OrderType>;
};

/** One door event imported from ARX, for the door log page. */
export type DoorLogEventType = {
  __typename?: 'DoorLogEventType';
  /** The event name in ARX, e.g. controller.access.card.valid.pin */
  arxEvent?: Maybe<Scalars['String']['output']>;
  cardFormat?: Maybe<Scalars['String']['output']>;
  doorIdentifier: Scalars['String']['output'];
  eventType: NfcNfcAccessEventEventTypeChoices;
  /** USER: a card registered to a website user. EXTERNAL_CARD: an external card from Django admin. ARX_ONLY: a card the website does not know; the name is the one ARX has. */
  holderKind: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isWebsiteUser: Scalars['Boolean']['output'];
  mifareCsnReported: Scalars['String']['output'];
  /** The website user's name, or the name ARX has when the card is not registered on the website. */
  name?: Maybe<Scalars['String']['output']>;
  occurredAt: Scalars['DateTime']['output'];
  personName: Scalars['String']['output'];
};

export type DoorLogPage = {
  __typename?: 'DoorLogPage';
  events: Array<DoorLogEventType>;
  total: Scalars['Int']['output'];
};

export type EmailInput = {
  cabins?: InputMaybe<Array<Scalars['Int']['input']>>;
  checkIn?: InputMaybe<Scalars['Date']['input']>;
  checkOut?: InputMaybe<Scalars['Date']['input']>;
  emailType?: InputMaybe<Scalars['String']['input']>;
  externalParticipants?: InputMaybe<Scalars['Int']['input']>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  internalParticipants?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  receiverEmail?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Sets the field is_attending to False in the Sign Up for the user that
 * sent the request, for the event with the given ID
 * NOTE: The sign up still exists, it is not deleted from the database
 *       when a user signs off an event
 */
export type EventSignOff = {
  __typename?: 'EventSignOff';
  event?: Maybe<EventType>;
  isFull?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Creates a new Sign Up for the user that sent the request, for the event
 * with the given ID
 */
export type EventSignUp = {
  __typename?: 'EventSignUp';
  event?: Maybe<EventType>;
  isFull?: Maybe<Scalars['Boolean']['output']>;
};

export type EventSignUpInput = {
  extraInformation?: InputMaybe<Scalars['String']['input']>;
};

export type EventType = {
  __typename?: 'EventType';
  allowedGradeYears?: Maybe<Array<Scalars['Int']['output']>>;
  availableSlots?: Maybe<Scalars['Int']['output']>;
  bindingSignup: Scalars['Boolean']['output'];
  category?: Maybe<CategoryType>;
  contactEmail: Scalars['String']['output'];
  deadline?: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  endTime?: Maybe<Scalars['DateTime']['output']>;
  hasExtraInformation: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isAttendable: Scalars['Boolean']['output'];
  isFull?: Maybe<Scalars['Boolean']['output']>;
  isHidden: Scalars['Boolean']['output'];
  location?: Maybe<Scalars['String']['output']>;
  organization: OrganizationType;
  price?: Maybe<Scalars['Float']['output']>;
  product?: Maybe<ProductType>;
  publisher?: Maybe<UserType>;
  shortDescription?: Maybe<Scalars['String']['output']>;
  signupOpenDate?: Maybe<Scalars['DateTime']['output']>;
  startTime: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  userAttendance?: Maybe<UserAttendingType>;
  usersAttending?: Maybe<Array<SignUpType>>;
  usersOnWaitingList?: Maybe<Array<SignUpType>>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormType = {
  __typename?: 'FormType';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization?: Maybe<OrganizationType>;
  questions: Array<QuestionType>;
  responder?: Maybe<UserType>;
  responders?: Maybe<Array<UserType>>;
  response?: Maybe<ResponseType>;
  responses?: Maybe<Array<ResponseType>>;
};


/** A form containing questions, optionally linked to a listing. */
export type FormTypeResponderArgs = {
  userId: Scalars['ID']['input'];
};


/** A form containing questions, optionally linked to a listing. */
export type FormTypeRespondersArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};


/** A form containing questions, optionally linked to a listing. */
export type FormTypeResponseArgs = {
  responsePk?: InputMaybe<Scalars['UUID']['input']>;
};

/** An enumeration. */
export enum FormsResponseStatusChoices {
  /** Red */
  A_0 = 'A_0',
  /** Yellow */
  A_1 = 'A_1',
  /** Green */
  A_2 = 'A_2',
  /** Unknown */
  None = 'NONE'
}

export type InitiateOrder = {
  __typename?: 'InitiateOrder';
  orderId?: Maybe<Scalars['UUID']['output']>;
  redirect?: Maybe<Scalars['String']['output']>;
};

export type JanHusAreaType = {
  __typename?: 'JanHusAreaType';
  bookingRequests: Array<JanHusBookingRequestType>;
  bookings: Array<JanHusBookingType>;
  children: Array<JanHusAreaType>;
  cleaningFee: Scalars['Decimal']['output'];
  conflictingAreaIds?: Maybe<Array<Scalars['ID']['output']>>;
  defaultDepositAmount: Scalars['Decimal']['output'];
  externalPricePerHour: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  internalPricePerHour: Scalars['Decimal']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<JanHusAreaType>;
};

export type JanHusBookingInput = {
  area: Scalars['ID']['input'];
  bookerEmail?: InputMaybe<Scalars['String']['input']>;
  bookerName?: InputMaybe<Scalars['String']['input']>;
  bookerPhone?: InputMaybe<Scalars['String']['input']>;
  cleaningRequested?: InputMaybe<Scalars['Boolean']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  depositAmount?: InputMaybe<Scalars['Decimal']['input']>;
  depositStatus?: InputMaybe<Scalars['String']['input']>;
  endsAt: Scalars['DateTime']['input'];
  eventType?: InputMaybe<Scalars['String']['input']>;
  isExternalBooking?: InputMaybe<Scalars['Boolean']['input']>;
  occasion?: InputMaybe<Scalars['String']['input']>;
  ownerOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  ownerUserId?: InputMaybe<Scalars['ID']['input']>;
  responsibleEmail: Scalars['String']['input'];
  responsibleName: Scalars['String']['input'];
  responsiblePhone: Scalars['String']['input'];
  startsAt: Scalars['DateTime']['input'];
};

export type JanHusBookingRequestInput = {
  area: Scalars['ID']['input'];
  cleaningRequested?: InputMaybe<Scalars['Boolean']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  endsAt: Scalars['DateTime']['input'];
  eventType?: InputMaybe<Scalars['String']['input']>;
  guestList?: InputMaybe<Scalars['String']['input']>;
  occasion?: InputMaybe<Scalars['String']['input']>;
  ownerOrganizationId?: InputMaybe<Scalars['ID']['input']>;
  requesterEmail?: InputMaybe<Scalars['String']['input']>;
  requesterName?: InputMaybe<Scalars['String']['input']>;
  requesterPhone?: InputMaybe<Scalars['String']['input']>;
  responsibleEmail: Scalars['String']['input'];
  responsibleName: Scalars['String']['input'];
  responsiblePhone: Scalars['String']['input'];
  startsAt: Scalars['DateTime']['input'];
};

export type JanHusBookingRequestType = {
  __typename?: 'JanHusBookingRequestType';
  adminComment: Scalars['String']['output'];
  area: JanHusAreaType;
  bookerMessage: Scalars['String']['output'];
  cleaningRequested: Scalars['Boolean']['output'];
  comment: Scalars['String']['output'];
  convertedBooking?: Maybe<JanHusBookingType>;
  createdAt: Scalars['DateTime']['output'];
  endsAt: Scalars['DateTime']['output'];
  eventType: JanhusJanHusBookingRequestEventTypeChoices;
  guestList: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  occasion: Scalars['String']['output'];
  ownerOrganization?: Maybe<OrganizationType>;
  reference: Scalars['String']['output'];
  requesterEmail: Scalars['String']['output'];
  requesterName: Scalars['String']['output'];
  requesterPhone: Scalars['String']['output'];
  requesterUser?: Maybe<UserType>;
  responsibleEmail: Scalars['String']['output'];
  responsibleName: Scalars['String']['output'];
  responsiblePhone: Scalars['String']['output'];
  startsAt: Scalars['DateTime']['output'];
  status: JanhusJanHusBookingRequestStatusChoices;
  updatedAt: Scalars['DateTime']['output'];
};

export type JanHusBookingSettingsInput = {
  bookingContactName?: InputMaybe<Scalars['String']['input']>;
  bookingContactPhone?: InputMaybe<Scalars['String']['input']>;
  bufferMinutes?: InputMaybe<Scalars['Int']['input']>;
  cleaningOptionEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  closingHour?: InputMaybe<Scalars['Int']['input']>;
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  contractCleaningDeadlineHours?: InputMaybe<Scalars['Int']['input']>;
  contractMaxFee?: InputMaybe<Scalars['Int']['input']>;
  contractRentAmount?: InputMaybe<Scalars['Int']['input']>;
  externalBookingsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  fallEndDate?: InputMaybe<Scalars['Date']['input']>;
  fallSemesterActive?: InputMaybe<Scalars['Boolean']['input']>;
  fallStartDate?: InputMaybe<Scalars['Date']['input']>;
  generalBookingOpensWeeksBefore?: InputMaybe<Scalars['Int']['input']>;
  keyBoxCode?: InputMaybe<Scalars['String']['input']>;
  minDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  openingHour?: InputMaybe<Scalars['Int']['input']>;
  organizationBookingOpensWeeksBefore?: InputMaybe<Scalars['Int']['input']>;
  privateBookingsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  slotGranularityMinutes?: InputMaybe<Scalars['Int']['input']>;
  springEndDate?: InputMaybe<Scalars['Date']['input']>;
  springSemesterActive?: InputMaybe<Scalars['Boolean']['input']>;
  springStartDate?: InputMaybe<Scalars['Date']['input']>;
};

export type JanHusBookingSettingsType = {
  __typename?: 'JanHusBookingSettingsType';
  bookingContactName: Scalars['String']['output'];
  bookingContactPhone: Scalars['String']['output'];
  bufferMinutes: Scalars['Int']['output'];
  cleaningOptionEnabled: Scalars['Boolean']['output'];
  closingHour: Scalars['Int']['output'];
  contractAddress: Scalars['String']['output'];
  contractCleaningDeadlineHours: Scalars['Int']['output'];
  contractMaxFee: Scalars['Int']['output'];
  contractRentAmount: Scalars['Int']['output'];
  externalBookingsEnabled: Scalars['Boolean']['output'];
  fallEndDate: Scalars['Date']['output'];
  fallSemesterActive: Scalars['Boolean']['output'];
  fallStartDate: Scalars['Date']['output'];
  generalBookingOpensWeeksBefore: Scalars['Int']['output'];
  guidelinesTitle?: Maybe<Scalars['String']['output']>;
  guidelinesUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** Only for people with permission. */
  keyBoxCode?: Maybe<Scalars['String']['output']>;
  minDurationMinutes: Scalars['Int']['output'];
  openingHour: Scalars['Int']['output'];
  organizationBookingOpensWeeksBefore: Scalars['Int']['output'];
  paymentProviderOrganization?: Maybe<OrganizationType>;
  privateBookingsEnabled: Scalars['Boolean']['output'];
  slotGranularityMinutes: Scalars['Int']['output'];
  springEndDate: Scalars['Date']['output'];
  springSemesterActive: Scalars['Boolean']['output'];
  springStartDate: Scalars['Date']['output'];
};

export type JanHusBookingType = {
  __typename?: 'JanHusBookingType';
  adminComment: Scalars['String']['output'];
  area: JanHusAreaType;
  bookerEmail: Scalars['String']['output'];
  bookerMessage: Scalars['String']['output'];
  bookerName: Scalars['String']['output'];
  bookerPhone: Scalars['String']['output'];
  bookerUser?: Maybe<UserType>;
  cleaningRequested: Scalars['Boolean']['output'];
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdByUser?: Maybe<UserType>;
  depositAmount: Scalars['Decimal']['output'];
  depositStatus: JanhusJanHusBookingDepositStatusChoices;
  doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices;
  /** Why the booker will not get the door, for JanHus admins. Empty when they will. */
  doorAccessWarnings: Array<Scalars['String']['output']>;
  durationMinutes?: Maybe<Scalars['Int']['output']>;
  endsAt: Scalars['DateTime']['output'];
  eventType: JanhusJanHusBookingEventTypeChoices;
  guestList: Scalars['String']['output'];
  guestListEntries?: Maybe<Array<JanHusGuestListEntryType>>;
  id: Scalars['ID']['output'];
  isExternalBooking: Scalars['Boolean']['output'];
  manuallyMarkedAsPaid: Scalars['Boolean']['output'];
  occasion: Scalars['String']['output'];
  organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices;
  outstandingDepositAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Who has the booking, for the calendar: the organisation, the owner's first and last name, or the booker's name for an external booking. Only for logged-in users. */
  ownerDisplayName?: Maybe<Scalars['String']['output']>;
  ownerOrganization?: Maybe<OrganizationType>;
  ownerUser?: Maybe<UserType>;
  priceOverrideAmount?: Maybe<Scalars['Decimal']['output']>;
  priceOverrideTier?: Maybe<JanhusJanHusBookingPriceOverrideTierChoices>;
  reference: Scalars['String']['output'];
  requestedAt?: Maybe<Scalars['DateTime']['output']>;
  responsibleEmail: Scalars['String']['output'];
  responsibleName: Scalars['String']['output'];
  responsiblePhone: Scalars['String']['output'];
  responsibleUser?: Maybe<UserType>;
  sourceRequests: Array<JanHusBookingRequestType>;
  startsAt: Scalars['DateTime']['output'];
  status: JanhusJanHusBookingStatusChoices;
  totalPrice?: Maybe<Scalars['Decimal']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  vippsOrder?: Maybe<OrderType>;
  vippsProduct?: Maybe<ProductType>;
};

export type JanHusContractPreviewInput = {
  area: Scalars['ID']['input'];
  endsAt: Scalars['DateTime']['input'];
  occasion?: InputMaybe<Scalars['String']['input']>;
  requesterEmail?: InputMaybe<Scalars['String']['input']>;
  requesterName?: InputMaybe<Scalars['String']['input']>;
  requesterPhone?: InputMaybe<Scalars['String']['input']>;
  startsAt: Scalars['DateTime']['input'];
};

export type JanHusGuestListEntryType = {
  __typename?: 'JanHusGuestListEntryType';
  displayName: Scalars['String']['output'];
  feideUserid: Scalars['String']['output'];
};

/** A website user a JanHus admin can link to a booking (booker or responsible). */
export type JanHusUserSearchResultType = {
  __typename?: 'JanHusUserSearchResultType';
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

/** An enumeration. */
export enum JanhusJanHusBookingDepositStatusChoices {
  /** Not required */
  NotRequired = 'NOT_REQUIRED',
  /** Paid */
  Paid = 'PAID',
  /** Refunded */
  Refunded = 'REFUNDED',
  /** Requested */
  Requested = 'REQUESTED',
  /** Required */
  Required = 'REQUIRED',
  /** Withheld */
  Withheld = 'WITHHELD'
}

/** An enumeration. */
export enum JanhusJanHusBookingDoorAccessPolicyChoices {
  /** Booker, responsible and guest list */
  AllParticipants = 'ALL_PARTICIPANTS',
  /** Booker and responsible */
  BookerAndResponsible = 'BOOKER_AND_RESPONSIBLE',
  /** Booker only */
  BookerOnly = 'BOOKER_ONLY'
}

/** An enumeration. */
export enum JanhusJanHusBookingEventTypeChoices {
  /** External */
  External = 'EXTERNAL',
  /** Internal */
  Internal = 'INTERNAL',
  /** Open to all Indøk students */
  OpenForIndok = 'OPEN_FOR_INDOK',
  /** Private */
  Private = 'PRIVATE'
}

/** An enumeration. */
export enum JanhusJanHusBookingOrganizationDoorAccessChoices {
  /** Only the booker */
  BookerOnly = 'BOOKER_ONLY',
  /** The organisation's leaders (HR) */
  Leaders = 'LEADERS'
}

/** An enumeration. */
export enum JanhusJanHusBookingPriceOverrideTierChoices {
  /** External */
  External = 'EXTERNAL',
  /** Internal */
  Internal = 'INTERNAL'
}

/** An enumeration. */
export enum JanhusJanHusBookingRequestEventTypeChoices {
  /** External */
  External = 'EXTERNAL',
  /** Internal */
  Internal = 'INTERNAL',
  /** Open to all Indøk students */
  OpenForIndok = 'OPEN_FOR_INDOK',
  /** Private */
  Private = 'PRIVATE'
}

/** An enumeration. */
export enum JanhusJanHusBookingRequestStatusChoices {
  /** Approved */
  Approved = 'APPROVED',
  /** Pending */
  Pending = 'PENDING',
  /** Rejected */
  Rejected = 'REJECTED'
}

/** An enumeration. */
export enum JanhusJanHusBookingStatusChoices {
  /** Blocked */
  Blocked = 'BLOCKED',
  /** Cancelled */
  Cancelled = 'CANCELLED',
  /** Confirmed */
  Confirmed = 'CONFIRMED',
  /** Declined */
  Declined = 'DECLINED',
  /** Pending admin review */
  PendingAdminReview = 'PENDING_ADMIN_REVIEW'
}

export type ListingType = {
  __typename?: 'ListingType';
  applicationUrl?: Maybe<Scalars['String']['output']>;
  chips: Array<Scalars['String']['output']>;
  deadline: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  endDatetime: Scalars['DateTime']['output'];
  form?: Maybe<FormType>;
  heroImageUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  organization: OrganizationType;
  readMoreUrl?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  startDatetime: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  viewCount: Scalars['Int']['output'];
};

export type Logout = {
  __typename?: 'Logout';
  idToken?: Maybe<Scalars['String']['output']>;
};

export type MembershipInput = {
  groupId: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type MembershipType = {
  __typename?: 'MembershipType';
  group?: Maybe<ResponsibleGroupType>;
  id: Scalars['ID']['output'];
  organization: OrganizationType;
  user: UserType;
};

export type Mutations = {
  __typename?: 'Mutations';
  addMembershipByIdentifier?: Maybe<AddMembershipByIdentifier>;
  /**
   * Sets the field is_attending to False in the Sign Up for the user with the
   * given ID, for the event with the given ID
   * NOTE: The sign up still exists, it is not deleted from the database
   *       when a user signs off an event
   */
  adminEventSignOff?: Maybe<AdminEventSignOff>;
  adminUpdateUser?: Maybe<AdminUpdateUser>;
  adminUpdateUserNfc?: Maybe<AdminUpdateUserNfc>;
  assignMembership?: Maybe<AssignMembership>;
  attemptCapturePayment?: Maybe<AttemptCapturePayment>;
  authUser: AuthUser;
  createArchivedocument?: Maybe<CreateArchiveDocument>;
  createBlog?: Maybe<CreateBlog>;
  createBlogPost?: Maybe<CreateBlogPost>;
  /** Add a new booking to the database */
  createBooking?: Maybe<CreateBooking>;
  /** Create a new event category */
  createCategory?: Maybe<CreateCategory>;
  /** Create a new event */
  createEvent?: Maybe<CreateEvent>;
  createForm?: Maybe<CreateForm>;
  createJanhusBooking?: Maybe<CreateJanHusBooking>;
  createJanhusBookingRequest?: Maybe<CreateJanHusBookingRequest>;
  createJanhusPaymentProduct?: Maybe<CreateJanHusPaymentProduct>;
  /** Creates a new listing */
  createListing?: Maybe<CreateListing>;
  createOrganization?: Maybe<CreateOrganization>;
  createProduct?: Maybe<CreateProduct>;
  createQuestion?: Maybe<CreateQuestion>;
  createUpdateAndDeleteOptions?: Maybe<CreateUpdateAndDeleteOptions>;
  deleteAnswer?: Maybe<DeleteAnswer>;
  deleteAnswers?: Maybe<DeleteAnswersToForm>;
  deleteArchivedocument?: Maybe<DeleteArchiveDocument>;
  deleteBlog?: Maybe<DeleteBlog>;
  deleteBlogPost?: Maybe<DeleteBlogPost>;
  /** Deletes the booking with the given ID */
  deleteBooking?: Maybe<DeleteBooking>;
  /** Deletes the category with a given ID */
  deleteCategory?: Maybe<DeleteCategory>;
  /** Deletes the event with the given ID */
  deleteEvent?: Maybe<DeleteEvent>;
  deleteForm?: Maybe<DeleteForm>;
  deleteJanhusArea?: Maybe<DeleteJanHusArea>;
  deleteJanhusBooking?: Maybe<DeleteJanHusBooking>;
  deleteJanhusBookingRequest?: Maybe<DeleteJanHusBookingRequest>;
  /** Deletes the listing with the given ID */
  deleteListing?: Maybe<DeleteListing>;
  deleteOrganization?: Maybe<DeleteOrganization>;
  deleteQuestion?: Maybe<DeleteQuestion>;
  deliveredProduct?: Maybe<DeliveredProduct>;
  /**
   * Sets the field is_attending to False in the Sign Up for the user that
   * sent the request, for the event with the given ID
   * NOTE: The sign up still exists, it is not deleted from the database
   *       when a user signs off an event
   */
  eventSignOff?: Maybe<EventSignOff>;
  /**
   * Creates a new Sign Up for the user that sent the request, for the event
   * with the given ID
   */
  eventSignUp?: Maybe<EventSignUp>;
  initiateOrder?: Maybe<InitiateOrder>;
  logout?: Maybe<Logout>;
  refundOrder?: Maybe<RefundOrder>;
  refundOrderAttempt?: Maybe<RefundOrderAttempt>;
  removeMembership?: Maybe<RemoveMembership>;
  reviewJanhusBooking?: Maybe<ReviewJanHusBooking>;
  reviewJanhusBookingRequest?: Maybe<ReviewJanHusBookingRequest>;
  /** Sends email to the user or an admin (or both) */
  sendEmail?: Maybe<SendEmail>;
  /** Send an email to all users signed up to an event */
  sendEventMails?: Maybe<SendEventEmails>;
  submitAnswers?: Maybe<SubmitOrUpdateAnswers>;
  updateArchivedocument?: Maybe<UpdateArchiveDocument>;
  updateBlog?: Maybe<UpdateBlog>;
  updateBlogPost?: Maybe<UpdateBlogPost>;
  /** Change the given booking */
  updateBooking?: Maybe<UpdateBooking>;
  /** Update the booking semester */
  updateBookingSemester?: Maybe<UpdateBookingSemester>;
  /** Change the given cabin */
  updateCabin?: Maybe<UpdateCabin>;
  /** Updates the category with a given ID with the data in category_data */
  updateCategory?: Maybe<UpdateCategory>;
  /** Updates the event with a given ID with the data in event_data */
  updateEvent?: Maybe<UpdateEvent>;
  updateForm?: Maybe<UpdateForm>;
  updateJanhusArea?: Maybe<UpdateJanHusArea>;
  updateJanhusBooking?: Maybe<UpdateJanHusBooking>;
  updateJanhusBookingSettings?: Maybe<UpdateJanHusBookingSettings>;
  updateListing?: Maybe<UpdateListing>;
  updateOrganization?: Maybe<UpdateOrganization>;
  updateQuestion?: Maybe<UpdateQuestion>;
  updateUser?: Maybe<UpdateUser>;
  upsertMembership?: Maybe<UpsertMembership>;
};


export type MutationsAddMembershipByIdentifierArgs = {
  identifier: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
};


export type MutationsAdminEventSignOffArgs = {
  eventId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationsAdminUpdateUserArgs = {
  userData: AdminUserInput;
  userId: Scalars['ID']['input'];
};


export type MutationsAdminUpdateUserNfcArgs = {
  nfcData: AdminUserNfcInput;
  userId: Scalars['ID']['input'];
};


export type MutationsAssignMembershipArgs = {
  membershipData: MembershipInput;
};


export type MutationsAttemptCapturePaymentArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationsAuthUserArgs = {
  code: Scalars['String']['input'];
};


export type MutationsCreateArchivedocumentArgs = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  fileLocation?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  typeDoc?: InputMaybe<Scalars['String']['input']>;
  webLink?: InputMaybe<Scalars['String']['input']>;
};


export type MutationsCreateBlogArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsCreateBlogPostArgs = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  blogId?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationsCreateBookingArgs = {
  bookingData?: InputMaybe<BookingInput>;
};


export type MutationsCreateCategoryArgs = {
  categoryData: CategoryInput;
};


export type MutationsCreateEventArgs = {
  eventData: CreateEventInput;
};


export type MutationsCreateFormArgs = {
  formData: CreateFormInput;
  listingId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsCreateJanhusBookingArgs = {
  bookingData: JanHusBookingInput;
};


export type MutationsCreateJanhusBookingRequestArgs = {
  requestData: JanHusBookingRequestInput;
};


export type MutationsCreateJanhusPaymentProductArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationsCreateListingArgs = {
  listingData: CreateListingInput;
};


export type MutationsCreateOrganizationArgs = {
  organizationData: OrganizationInput;
};


export type MutationsCreateProductArgs = {
  productData: CreateProductInput;
};


export type MutationsCreateQuestionArgs = {
  formId?: InputMaybe<Scalars['ID']['input']>;
  questionData: CreateQuestionInput;
};


export type MutationsCreateUpdateAndDeleteOptionsArgs = {
  optionData?: InputMaybe<Array<OptionInput>>;
  questionId: Scalars['ID']['input'];
};


export type MutationsDeleteAnswerArgs = {
  uuid: Scalars['ID']['input'];
};


export type MutationsDeleteAnswersArgs = {
  formId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteArchivedocumentArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteBlogArgs = {
  blogId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteBlogPostArgs = {
  blogPostId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteBookingArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteCategoryArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteEventArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteFormArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeleteJanhusAreaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeleteJanhusBookingArgs = {
  bookingId: Scalars['ID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};


export type MutationsDeleteJanhusBookingRequestArgs = {
  requestId: Scalars['ID']['input'];
};


export type MutationsDeleteListingArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeleteQuestionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsDeliveredProductArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationsEventSignOffArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationsEventSignUpArgs = {
  data?: InputMaybe<EventSignUpInput>;
  eventId: Scalars['ID']['input'];
};


export type MutationsInitiateOrderArgs = {
  fallbackRedirect?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationsRefundOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationsRefundOrderAttemptArgs = {
  orderId: Scalars['ID']['input'];
  paymentAttempt: Scalars['Int']['input'];
};


export type MutationsRemoveMembershipArgs = {
  membershipId: Scalars['ID']['input'];
};


export type MutationsReviewJanhusBookingArgs = {
  reviewData: ReviewJanHusBookingInput;
};


export type MutationsReviewJanhusBookingRequestArgs = {
  reviewData: ReviewJanHusBookingRequestInput;
};


export type MutationsSendEmailArgs = {
  emailInput?: InputMaybe<EmailInput>;
};


export type MutationsSendEventMailsArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  receiverEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  subject: Scalars['String']['input'];
};


export type MutationsSubmitAnswersArgs = {
  answersData?: InputMaybe<Array<AnswerInput>>;
  formId: Scalars['ID']['input'];
};


export type MutationsUpdateArchivedocumentArgs = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  fileLocation?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  typeDoc?: InputMaybe<Scalars['String']['input']>;
  webLink?: InputMaybe<Scalars['String']['input']>;
};


export type MutationsUpdateBlogArgs = {
  blogData?: InputMaybe<UpdateBlogInput>;
};


export type MutationsUpdateBlogPostArgs = {
  blogPostData?: InputMaybe<UpdateBlogPostInput>;
};


export type MutationsUpdateBookingArgs = {
  bookingData?: InputMaybe<UpdateBookingInput>;
};


export type MutationsUpdateBookingSemesterArgs = {
  semesterData?: InputMaybe<UpdateBookingSemesterInput>;
};


export type MutationsUpdateCabinArgs = {
  cabinData?: InputMaybe<UpdateCabinInput>;
};


export type MutationsUpdateCategoryArgs = {
  categoryData?: InputMaybe<CategoryInput>;
  id: Scalars['ID']['input'];
};


export type MutationsUpdateEventArgs = {
  eventData?: InputMaybe<UpdateEventInput>;
  id: Scalars['ID']['input'];
};


export type MutationsUpdateFormArgs = {
  formData: BaseFormInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationsUpdateJanhusAreaArgs = {
  areaData: UpdateJanHusAreaInput;
};


export type MutationsUpdateJanhusBookingArgs = {
  bookingData: UpdateJanHusBookingInput;
};


export type MutationsUpdateJanhusBookingSettingsArgs = {
  settingsData: JanHusBookingSettingsInput;
};


export type MutationsUpdateListingArgs = {
  id: Scalars['ID']['input'];
  listingData?: InputMaybe<BaseListingInput>;
};


export type MutationsUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  organizationData?: InputMaybe<OrganizationInput>;
};


export type MutationsUpdateQuestionArgs = {
  id: Scalars['ID']['input'];
  questionData: BaseQuestionInput;
};


export type MutationsUpdateUserArgs = {
  userData?: InputMaybe<UserInput>;
};


export type MutationsUpsertMembershipArgs = {
  membershipData: MembershipInput;
};

/** An enumeration. */
export enum NfcNfcAccessEventEventTypeChoices {
  /** Access denied */
  AccessDenied = 'ACCESS_DENIED',
  /** Access granted */
  AccessGranted = 'ACCESS_GRANTED',
  /** Door opened */
  DoorOpened = 'DOOR_OPENED',
  /** Exit button */
  ExitButton = 'EXIT_BUTTON',
  /** Door forced open */
  ForcedOpen = 'FORCED_OPEN'
}

/** One change of someone's permanent door access. */
export type NfcPermanentAccessChangeType = {
  __typename?: 'NfcPermanentAccessChangeType';
  changedAt: Scalars['DateTime']['output'];
  /** The name of the person who made the change. */
  changedBy?: Maybe<Scalars['String']['output']>;
  /** True if access was given, False if it was removed. */
  given: Scalars['Boolean']['output'];
  reason: Scalars['String']['output'];
};

export type OptionInput = {
  answer: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Option for multiple choice questions */
export type OptionType = {
  __typename?: 'OptionType';
  answer: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  question: QuestionType;
};

export type OrderType = {
  __typename?: 'OrderType';
  deliveredProduct: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  paymentStatus: PaymentStatus;
  product: ProductType;
  quantity: Scalars['Int']['output'];
  timestamp: Scalars['DateTime']['output'];
  totalPrice: Scalars['Decimal']['output'];
  user: UserType;
};

export type OrdersByStatusType = {
  __typename?: 'OrdersByStatusType';
  length?: Maybe<Scalars['Int']['output']>;
  orders?: Maybe<Array<OrderType>>;
};

export type OrganizationInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type OrganizationType = {
  __typename?: 'OrganizationType';
  absoluteSlug?: Maybe<Scalars['String']['output']>;
  children: Array<OrganizationType>;
  color?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  events: Array<EventType>;
  hrGroup?: Maybe<ResponsibleGroupType>;
  id: Scalars['ID']['output'];
  listings?: Maybe<Array<ListingType>>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parent?: Maybe<OrganizationType>;
  permissionGroups?: Maybe<Array<ResponsibleGroupType>>;
  primaryGroup?: Maybe<ResponsibleGroupType>;
  slug: Scalars['String']['output'];
  users: Array<UserType>;
};

/** An enumeration. */
export enum PaymentStatus {
  Cancelled = 'CANCELLED',
  Captured = 'CAPTURED',
  Failed = 'FAILED',
  Initiated = 'INITIATED',
  Refunded = 'REFUNDED',
  Rejected = 'REJECTED',
  Reserved = 'RESERVED'
}

export type ProductType = {
  __typename?: 'ProductType';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  maxBuyableQuantity: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
  shopItem: Scalars['Boolean']['output'];
};

export type Queries = {
  __typename?: 'Queries';
  activeBookingResponsible?: Maybe<BookingResponsibleType>;
  adminAllBookings?: Maybe<Array<AdminBookingType>>;
  adminJanhusBookings?: Maybe<Array<JanHusBookingType>>;
  adminUser?: Maybe<UserType>;
  allBlogPosts?: Maybe<Array<BlogPostType>>;
  allBlogs?: Maybe<Array<BlogType>>;
  allBookings?: Maybe<Array<AllBookingsType>>;
  allCategories?: Maybe<Array<CategoryType>>;
  allEvents?: Maybe<Array<EventType>>;
  allOrganizations?: Maybe<Array<OrganizationType>>;
  allUserOrders?: Maybe<Array<OrderType>>;
  allUsers?: Maybe<Array<UserType>>;
  archiveByTypes: Array<ArchiveDocumentType>;
  attendeeReport?: Maybe<Scalars['String']['output']>;
  attendeeReportOrg?: Maybe<Scalars['String']['output']>;
  attendeeReports?: Maybe<Scalars['String']['output']>;
  availableYears: Array<Scalars['String']['output']>;
  blog?: Maybe<BlogType>;
  blogPost?: Maybe<BlogPostType>;
  bookingSemester?: Maybe<UpdateBookingSemesterType>;
  cabins?: Maybe<Array<CabinType>>;
  canManageUserNfc: Scalars['Boolean']['output'];
  canManageUserProfiles: Scalars['Boolean']['output'];
  category?: Maybe<CategoryType>;
  defaultEvents?: Maybe<Array<EventType>>;
  /** Door events from ARX, newest first. Needs nfc.view_door_log. */
  doorLog?: Maybe<DoorLogPage>;
  event?: Maybe<EventType>;
  eventFilteredOrganizations?: Maybe<Array<OrganizationType>>;
  featuredArchive: Array<ArchiveDocumentType>;
  form?: Maybe<FormType>;
  forms?: Maybe<Array<FormType>>;
  hasPermission?: Maybe<Scalars['Boolean']['output']>;
  janhusAreas?: Maybe<Array<JanHusAreaType>>;
  janhusBookableOrganizations?: Maybe<Array<OrganizationType>>;
  janhusBookingRequests?: Maybe<Array<JanHusBookingRequestType>>;
  janhusBookingSettings?: Maybe<JanHusBookingSettingsType>;
  janhusBookings?: Maybe<Array<JanHusBookingType>>;
  /** The contract as HTML, filled in with what the booker has entered. Everything in it is escaped. */
  janhusContractPreview?: Maybe<Scalars['String']['output']>;
  janhusGuestSearch?: Maybe<Array<JanHusGuestListEntryType>>;
  janhusGuestSearchForRequest?: Maybe<Array<JanHusGuestListEntryType>>;
  janhusMyBookingRequests?: Maybe<Array<JanHusBookingRequestType>>;
  janhusMyBookings?: Maybe<Array<JanHusBookingType>>;
  /** Website users to link to a booking as booker or responsible. JanHus admins only. */
  janhusUserSearch?: Maybe<Array<JanHusUserSearchResultType>>;
  listing?: Maybe<ListingType>;
  listings?: Maybe<Array<ListingType>>;
  logout: Scalars['String']['output'];
  memberships?: Maybe<Array<MembershipType>>;
  myCabinBookings?: Maybe<Array<AdminBookingType>>;
  /** Everyone with the permanent access box ticked. */
  nfcPermanentAccessUsers?: Maybe<Array<UserType>>;
  nfcSelfServiceEnabled: Scalars['Boolean']['output'];
  nfcUser?: Maybe<UserType>;
  nfcUserSearch?: Maybe<Array<UserType>>;
  order?: Maybe<OrderType>;
  ordersByStatus?: Maybe<OrdersByStatusType>;
  organization?: Maybe<OrganizationType>;
  paginatedShopOrders?: Maybe<Array<OrderType>>;
  product?: Maybe<ProductType>;
  products?: Maybe<Array<ProductType>>;
  response?: Maybe<ResponseType>;
  responses?: Maybe<Array<ResponseType>>;
  serverTime?: Maybe<Scalars['DateTime']['output']>;
  signUps?: Maybe<SignUpType>;
  user?: Maybe<UserType>;
  userOrders?: Maybe<Array<OrderType>>;
  userSearch?: Maybe<Array<UserType>>;
};


export type QueriesAdminAllBookingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesAdminJanhusBookingsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesAdminUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueriesAllEventsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  organization?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueriesAllOrganizationsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesArchiveByTypesArgs = {
  names?: InputMaybe<Scalars['String']['input']>;
  typeDoc: Array<InputMaybe<Scalars['String']['input']>>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueriesAttendeeReportArgs = {
  eventId: Scalars['ID']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  filetype?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesAttendeeReportOrgArgs = {
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  filetype?: InputMaybe<Scalars['String']['input']>;
  orgId: Scalars['ID']['input'];
};


export type QueriesAttendeeReportsArgs = {
  eventIds: Array<Scalars['ID']['input']>;
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  filetype?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesBlogArgs = {
  blogId: Scalars['ID']['input'];
};


export type QueriesBlogPostArgs = {
  blogPostId: Scalars['ID']['input'];
};


export type QueriesCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueriesDoorLogArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  result?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['DateTime']['input']>;
  until?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueriesEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueriesFormArgs = {
  formId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesHasPermissionArgs = {
  permission: Scalars['String']['input'];
};


export type QueriesJanhusAreasArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueriesJanhusBookingRequestsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesJanhusBookingsArgs = {
  area?: InputMaybe<Scalars['ID']['input']>;
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueriesJanhusContractPreviewArgs = {
  contractData: JanHusContractPreviewInput;
};


export type QueriesJanhusGuestSearchArgs = {
  bookingId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueriesJanhusGuestSearchForRequestArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueriesJanhusUserSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueriesListingArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesListingsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesMembershipsArgs = {
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesNfcUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueriesNfcUserSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueriesOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueriesOrdersByStatusArgs = {
  productId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type QueriesOrganizationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueriesPaginatedShopOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueriesProductArgs = {
  productId: Scalars['ID']['input'];
};


export type QueriesResponseArgs = {
  formId: Scalars['ID']['input'];
  responseId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueriesResponsesArgs = {
  formId: Scalars['ID']['input'];
};


export type QueriesSignUpsArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueriesUserSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};

/** A question on a form. */
export type QuestionType = {
  __typename?: 'QuestionType';
  answer?: Maybe<AnswerType>;
  answers?: Maybe<Array<AnswerType>>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mandatory: Scalars['Boolean']['output'];
  options?: Maybe<Array<OptionType>>;
  question: Scalars['String']['output'];
  questionType?: Maybe<QuestionTypeEnum>;
};


/** A question on a form. */
export type QuestionTypeAnswersArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export enum QuestionTypeEnum {
  Checkboxes = 'CHECKBOXES',
  Dropdown = 'DROPDOWN',
  FileUpload = 'FILE_UPLOAD',
  MultipleChoice = 'MULTIPLE_CHOICE',
  Paragraph = 'PARAGRAPH',
  ShortAnswer = 'SHORT_ANSWER',
  Slider = 'SLIDER'
}

export type RefundOrder = {
  __typename?: 'RefundOrder';
  ok?: Maybe<Scalars['Boolean']['output']>;
  order?: Maybe<OrderType>;
};

export type RefundOrderAttempt = {
  __typename?: 'RefundOrderAttempt';
  ok?: Maybe<Scalars['Boolean']['output']>;
  order?: Maybe<OrderType>;
  paymentAttempt?: Maybe<Scalars['Int']['output']>;
};

export type RemoveMembership = {
  __typename?: 'RemoveMembership';
  ok?: Maybe<Scalars['Boolean']['output']>;
  removedMember?: Maybe<UserType>;
};

/** A response instance that contains information about a user's response to a form. */
export type ResponseType = {
  __typename?: 'ResponseType';
  answers: Array<AnswerType>;
  form: FormType;
  id?: Maybe<Scalars['UUID']['output']>;
  questions?: Maybe<Array<QuestionType>>;
  respondent: UserType;
  status?: Maybe<FormsResponseStatusChoices>;
  uuid: Scalars['UUID']['output'];
};

export type ResponsibleGroupType = {
  __typename?: 'ResponsibleGroupType';
  description?: Maybe<Scalars['String']['output']>;
  groupType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization: OrganizationType;
  uuid: Scalars['UUID']['output'];
};

export type ReviewJanHusBooking = {
  __typename?: 'ReviewJanHusBooking';
  booking?: Maybe<JanHusBookingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type ReviewJanHusBookingInput = {
  adminComment?: InputMaybe<Scalars['String']['input']>;
  bookerMessage?: InputMaybe<Scalars['String']['input']>;
  depositAmount?: InputMaybe<Scalars['Decimal']['input']>;
  depositStatus?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewJanHusBookingRequest = {
  __typename?: 'ReviewJanHusBookingRequest';
  booking?: Maybe<JanHusBookingType>;
  bookingRequest?: Maybe<JanHusBookingRequestType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  /** Existing bookings this booking overlaps. Non-empty when an admin has deliberately double-booked. */
  overlappingBookings?: Maybe<Array<JanHusBookingType>>;
};

export type ReviewJanHusBookingRequestInput = {
  adminComment?: InputMaybe<Scalars['String']['input']>;
  bookerMessage?: InputMaybe<Scalars['String']['input']>;
  convertToBooking?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};

/** Sends email to the user or an admin (or both) */
export type SendEmail = {
  __typename?: 'SendEmail';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Send an email to all users signed up to an event */
export type SendEventEmails = {
  __typename?: 'SendEventEmails';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type SignUpType = {
  __typename?: 'SignUpType';
  event: EventType;
  extraInformation: Scalars['String']['output'];
  hasBoughtTicket?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  isAttending: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTime']['output'];
  user: UserType;
  userAllergies?: Maybe<Scalars['String']['output']>;
  userEmail: Scalars['String']['output'];
  userGradeYear: Scalars['Int']['output'];
  userPhoneNumber: Scalars['String']['output'];
};

export type SubmitOrUpdateAnswers = {
  __typename?: 'SubmitOrUpdateAnswers';
  message?: Maybe<Scalars['String']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateArchiveDocument = {
  __typename?: 'UpdateArchiveDocument';
  event?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBlog = {
  __typename?: 'UpdateBlog';
  blog?: Maybe<BlogType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBlogInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateBlogPost = {
  __typename?: 'UpdateBlogPost';
  blogPost?: Maybe<BlogPostType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBlogPostInput = {
  blogId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Change the given booking */
export type UpdateBooking = {
  __typename?: 'UpdateBooking';
  booking?: Maybe<AllBookingsType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBookingInput = {
  cabins?: InputMaybe<Array<Scalars['Int']['input']>>;
  checkIn?: InputMaybe<Scalars['Date']['input']>;
  checkOut?: InputMaybe<Scalars['Date']['input']>;
  declineReason?: InputMaybe<Scalars['String']['input']>;
  externalParticipants?: InputMaybe<Scalars['Int']['input']>;
  extraInfo?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  internalParticipants?: InputMaybe<Scalars['Int']['input']>;
  isDeclined?: InputMaybe<Scalars['Boolean']['input']>;
  isTentative?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  receiverEmail?: InputMaybe<Scalars['String']['input']>;
};

/** Update the booking semester */
export type UpdateBookingSemester = {
  __typename?: 'UpdateBookingSemester';
  bookingSemester?: Maybe<UpdateBookingSemesterType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateBookingSemesterInput = {
  fallEndDate?: InputMaybe<Scalars['Date']['input']>;
  fallSemesterActive?: InputMaybe<Scalars['Boolean']['input']>;
  fallStartDate?: InputMaybe<Scalars['Date']['input']>;
  springEndDate?: InputMaybe<Scalars['Date']['input']>;
  springSemesterActive?: InputMaybe<Scalars['Boolean']['input']>;
  springStartDate?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateBookingSemesterType = {
  __typename?: 'UpdateBookingSemesterType';
  fallEndDate: Scalars['Date']['output'];
  fallSemesterActive: Scalars['Boolean']['output'];
  fallStartDate: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  springEndDate: Scalars['Date']['output'];
  springSemesterActive: Scalars['Boolean']['output'];
  springStartDate: Scalars['Date']['output'];
};

/** Change the given cabin */
export type UpdateCabin = {
  __typename?: 'UpdateCabin';
  cabin?: Maybe<CabinType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateCabinInput = {
  externalPrice?: InputMaybe<Scalars['Int']['input']>;
  externalPriceWeekend?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  internalPrice?: InputMaybe<Scalars['Int']['input']>;
  internalPriceWeekend?: InputMaybe<Scalars['Int']['input']>;
  maxGuests?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Updates the category with a given ID with the data in category_data */
export type UpdateCategory = {
  __typename?: 'UpdateCategory';
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Updates the event with a given ID with the data in event_data */
export type UpdateEvent = {
  __typename?: 'UpdateEvent';
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateEventInput = {
  allowedGradeYears?: InputMaybe<Array<Scalars['Int']['input']>>;
  availableSlots?: InputMaybe<Scalars['Int']['input']>;
  bindingSignup?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  hasExtraInformation?: InputMaybe<Scalars['Boolean']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isAttendable?: InputMaybe<Scalars['Boolean']['input']>;
  isHidden?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  signupOpenDate?: InputMaybe<Scalars['DateTime']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateForm = {
  __typename?: 'UpdateForm';
  form?: Maybe<FormType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateJanHusArea = {
  __typename?: 'UpdateJanHusArea';
  area?: Maybe<JanHusAreaType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateJanHusAreaInput = {
  cleaningFee?: InputMaybe<Scalars['Decimal']['input']>;
  defaultDepositAmount?: InputMaybe<Scalars['Decimal']['input']>;
  externalPricePerHour?: InputMaybe<Scalars['Decimal']['input']>;
  id: Scalars['ID']['input'];
  internalPricePerHour?: InputMaybe<Scalars['Decimal']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateJanHusBooking = {
  __typename?: 'UpdateJanHusBooking';
  booking?: Maybe<JanHusBookingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  /** Existing bookings this booking overlaps. Non-empty when an admin has deliberately double-booked. */
  overlappingBookings?: Maybe<Array<JanHusBookingType>>;
};

export type UpdateJanHusBookingInput = {
  adminComment?: InputMaybe<Scalars['String']['input']>;
  area?: InputMaybe<Scalars['ID']['input']>;
  bookerEmail?: InputMaybe<Scalars['String']['input']>;
  bookerMessage?: InputMaybe<Scalars['String']['input']>;
  bookerName?: InputMaybe<Scalars['String']['input']>;
  bookerPhone?: InputMaybe<Scalars['String']['input']>;
  bookerUser?: InputMaybe<Scalars['ID']['input']>;
  cleaningRequested?: InputMaybe<Scalars['Boolean']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  depositAmount?: InputMaybe<Scalars['Decimal']['input']>;
  depositStatus?: InputMaybe<Scalars['String']['input']>;
  doorAccessPolicy?: InputMaybe<Scalars['String']['input']>;
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  guestList?: InputMaybe<Scalars['String']['input']>;
  guestListUserFeideIds?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  manuallyMarkedAsPaid?: InputMaybe<Scalars['Boolean']['input']>;
  occasion?: InputMaybe<Scalars['String']['input']>;
  organizationDoorAccess?: InputMaybe<Scalars['String']['input']>;
  priceOverrideAmount?: InputMaybe<Scalars['Decimal']['input']>;
  priceOverrideTier?: InputMaybe<Scalars['String']['input']>;
  responsibleEmail?: InputMaybe<Scalars['String']['input']>;
  responsibleName?: InputMaybe<Scalars['String']['input']>;
  responsiblePhone?: InputMaybe<Scalars['String']['input']>;
  responsibleUser?: InputMaybe<Scalars['ID']['input']>;
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateJanHusBookingSettings = {
  __typename?: 'UpdateJanHusBookingSettings';
  bookingSettings?: Maybe<JanHusBookingSettingsType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateListing = {
  __typename?: 'UpdateListing';
  listing?: Maybe<ListingType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateOrganization = {
  __typename?: 'UpdateOrganization';
  ok?: Maybe<Scalars['Boolean']['output']>;
  organization?: Maybe<OrganizationType>;
};

export type UpdateQuestion = {
  __typename?: 'UpdateQuestion';
  ok?: Maybe<Scalars['Boolean']['output']>;
  question?: Maybe<QuestionType>;
};

export type UpdateUser = {
  __typename?: 'UpdateUser';
  user?: Maybe<UserType>;
};

export type UpsertMembership = {
  __typename?: 'UpsertMembership';
  membership?: Maybe<MembershipType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type UserAttendingType = {
  __typename?: 'UserAttendingType';
  hasBoughtTicket?: Maybe<Scalars['Boolean']['output']>;
  isOnWaitingList?: Maybe<Scalars['Boolean']['output']>;
  isSignedUp?: Maybe<Scalars['Boolean']['output']>;
  positionOnWaitingList?: Maybe<Scalars['Int']['output']>;
};

export type UserInput = {
  allergies?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  graduationYear?: InputMaybe<Scalars['Int']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  nfcMifareCsn?: InputMaybe<Scalars['String']['input']>;
  nfcPinCode?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  allergies?: Maybe<Scalars['String']['output']>;
  canUpdateYear?: Maybe<Scalars['Boolean']['output']>;
  dateJoined: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  events?: Maybe<Array<EventType>>;
  feideEmail: Scalars['String']['output'];
  feideUserid: Scalars['String']['output'];
  firstLogin: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  gradeYear?: Maybe<Scalars['Int']['output']>;
  graduationYear?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  idToken: Scalars['String']['output'];
  isIndok: Scalars['Boolean']['output'];
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  memberships: Array<MembershipType>;
  /** The card number as it appears on the user's card. Show this to the user. */
  nfcCardNumber?: Maybe<Scalars['String']['output']>;
  /** Whether a door PIN is set. The PIN itself is never returned. */
  nfcHasPin?: Maybe<Scalars['Boolean']['output']>;
  /** The number the door reads (10 digits). For admins and troubleshooting. */
  nfcMifareCsn?: Maybe<Scalars['String']['output']>;
  /** Why this person has permanent access. */
  nfcNote?: Maybe<Scalars['String']['output']>;
  nfcNoteUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the person who last changed the note. */
  nfcNoteUpdatedBy?: Maybe<Scalars['String']['output']>;
  nfcPermanentAccess?: Maybe<Scalars['Boolean']['output']>;
  /** Date when permanent access ends. */
  nfcPermanentAccessEnds?: Maybe<Scalars['DateTime']['output']>;
  /** Newest first. */
  nfcPermanentAccessHistory?: Maybe<Array<NfcPermanentAccessChangeType>>;
  /** ACTIVE, NOT_GRANTED, INACTIVE_USER, ENDED, CARD_DISABLED or NO_PIN. For door access admins. */
  nfcPermanentAccessStatus?: Maybe<Scalars['String']['output']>;
  organizations: Array<OrganizationType>;
  phoneNumber: Scalars['String']['output'];
  responses: Array<ResponseType>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
  yearUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ArchiveByTypesQueryVariables = Exact<{
  documentTypes: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
  names?: InputMaybe<Scalars['String']['input']>;
}>;


export type ArchiveByTypesQuery = { __typename?: 'Queries', archiveByTypes: Array<{ __typename?: 'ArchiveDocumentType', id: string, title: string, thumbnail?: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year?: number | null, webLink?: string | null }> };

export type FeaturedArchiveQueryVariables = Exact<{ [key: string]: never; }>;


export type FeaturedArchiveQuery = { __typename?: 'Queries', featuredArchive: Array<{ __typename?: 'ArchiveDocumentType', id: string, title: string, thumbnail?: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year?: number | null, webLink?: string | null }> };

export type AvailableYearsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableYearsQuery = { __typename?: 'Queries', availableYears: Array<string> };

export type DocumentFragment = { __typename?: 'ArchiveDocumentType', id: string, title: string, thumbnail?: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year?: number | null, webLink?: string | null };

export type DocumentsQueryVariables = Exact<{
  documentTypes: Array<Scalars['String']['input']> | Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
  names?: InputMaybe<Scalars['String']['input']>;
}>;


export type DocumentsQuery = { __typename?: 'Queries', availableYears: Array<string>, hasPermission?: boolean | null, archiveByTypes: Array<{ __typename?: 'ArchiveDocumentType', id: string, title: string, thumbnail?: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year?: number | null, webLink?: string | null }>, featuredArchive: Array<{ __typename?: 'ArchiveDocumentType', id: string, title: string, thumbnail?: string | null, typeDoc: ArchiveArchiveDocumentTypeDocChoices, year?: number | null, webLink?: string | null }> };

export type CabinFragment = { __typename?: 'CabinType', id: string, name: string, maxGuests: number, internalPrice: number, externalPrice: number, internalPriceWeekend: number, externalPriceWeekend: number };

export type BookingFragment = { __typename?: 'AllBookingsType', id: string, checkIn: string, checkOut: string, cabins: Array<{ __typename?: 'CabinType', id: string, name: string }> };

export type AdminBookingFragment = { __typename?: 'AdminBookingType', id: string, checkIn: string, checkOut: string, firstName: string, lastName: string, phone: string, receiverEmail: string, externalParticipants: number, internalParticipants: number, price?: number | null, isTentative: boolean, isDeclined: boolean, timestamp: string, extraInfo: string, declineReason: string, cabins: Array<{ __typename?: 'CabinType', id: string, name: string }> };

export type BookingResponsibleFragment = { __typename?: 'BookingResponsibleType', id: string, active?: boolean | null, firstName?: string | null, lastName?: string | null, email?: string | null, phone?: number | null };

export type BookingSemesterFragment = { __typename?: 'UpdateBookingSemesterType', fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean };

export type CreateBookingMutationVariables = Exact<{
  bookingData: BookingInput;
}>;


export type CreateBookingMutation = { __typename?: 'Mutations', createBooking?: { __typename?: 'CreateBooking', ok?: boolean | null } | null };

export type ConfirmBookingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConfirmBookingMutation = { __typename?: 'Mutations', updateBooking?: { __typename?: 'UpdateBooking', ok?: boolean | null } | null };

export type DeclineBookingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  declineReason?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeclineBookingMutation = { __typename?: 'Mutations', updateBooking?: { __typename?: 'UpdateBooking', ok?: boolean | null } | null };

export type SendEmailMutationVariables = Exact<{
  emailInput: EmailInput;
}>;


export type SendEmailMutation = { __typename?: 'Mutations', sendEmail?: { __typename?: 'SendEmail', ok?: boolean | null } | null };

export type UpdateCabinMutationVariables = Exact<{
  cabinData: UpdateCabinInput;
}>;


export type UpdateCabinMutation = { __typename?: 'Mutations', updateCabin?: { __typename?: 'UpdateCabin', cabin?: { __typename?: 'CabinType', id: string, name: string, maxGuests: number, internalPrice: number, externalPrice: number, internalPriceWeekend: number, externalPriceWeekend: number } | null } | null };

export type UpdateBookingSemesterMutationVariables = Exact<{
  semesterData: UpdateBookingSemesterInput;
}>;


export type UpdateBookingSemesterMutation = { __typename?: 'Mutations', updateBookingSemester?: { __typename?: 'UpdateBookingSemester', bookingSemester?: { __typename?: 'UpdateBookingSemesterType', fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean } | null } | null };

export type CabinsQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinsQuery = { __typename?: 'Queries', cabins?: Array<{ __typename?: 'CabinType', id: string, name: string, maxGuests: number, internalPrice: number, externalPrice: number, internalPriceWeekend: number, externalPriceWeekend: number }> | null };

export type AllBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBookingsQuery = { __typename?: 'Queries', allBookings?: Array<{ __typename?: 'AllBookingsType', id: string, checkIn: string, checkOut: string, cabins: Array<{ __typename?: 'CabinType', id: string, name: string }> }> | null };

export type MyCabinBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyCabinBookingsQuery = { __typename?: 'Queries', myCabinBookings?: Array<{ __typename?: 'AdminBookingType', id: string, checkIn: string, checkOut: string, firstName: string, lastName: string, phone: string, receiverEmail: string, externalParticipants: number, internalParticipants: number, price?: number | null, isTentative: boolean, isDeclined: boolean, timestamp: string, extraInfo: string, declineReason: string, cabins: Array<{ __typename?: 'CabinType', id: string, name: string }> }> | null };

export type AdminAllBookingsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type AdminAllBookingsQuery = { __typename?: 'Queries', adminAllBookings?: Array<{ __typename?: 'AdminBookingType', id: string, checkIn: string, checkOut: string, firstName: string, lastName: string, phone: string, receiverEmail: string, externalParticipants: number, internalParticipants: number, price?: number | null, isTentative: boolean, isDeclined: boolean, timestamp: string, extraInfo: string, declineReason: string, cabins: Array<{ __typename?: 'CabinType', id: string, name: string }> }> | null };

export type ActiveBookingResponsibleQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveBookingResponsibleQuery = { __typename?: 'Queries', activeBookingResponsible?: { __typename?: 'BookingResponsibleType', id: string, active?: boolean | null, firstName?: string | null, lastName?: string | null, email?: string | null, phone?: number | null } | null };

export type CabinsAndResponsiblesQueryVariables = Exact<{ [key: string]: never; }>;


export type CabinsAndResponsiblesQuery = { __typename?: 'Queries', cabins?: Array<{ __typename?: 'CabinType', id: string, name: string, maxGuests: number, internalPrice: number, externalPrice: number, internalPriceWeekend: number, externalPriceWeekend: number }> | null, activeBookingResponsible?: { __typename?: 'BookingResponsibleType', id: string, email?: string | null } | null };

export type BookingSemesterQueryVariables = Exact<{ [key: string]: never; }>;


export type BookingSemesterQuery = { __typename?: 'Queries', bookingSemester?: { __typename?: 'UpdateBookingSemesterType', fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean } | null };

export type ProductFragment = { __typename?: 'ProductType', id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean };

export type OrderFragment = { __typename?: 'OrderType', id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { __typename?: 'ProductType', id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string } };

export type InitiateOrderMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  fallbackRedirect?: InputMaybe<Scalars['String']['input']>;
}>;


export type InitiateOrderMutation = { __typename?: 'Mutations', initiateOrder?: { __typename?: 'InitiateOrder', redirect?: string | null, orderId?: string | null } | null };

export type AttemptCapturePaymentMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type AttemptCapturePaymentMutation = { __typename?: 'Mutations', attemptCapturePayment?: { __typename?: 'AttemptCapturePayment', status?: PaymentStatus | null, order?: { __typename?: 'OrderType', id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { __typename?: 'ProductType', id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string } } | null } | null };

export type DeliveredProductMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type DeliveredProductMutation = { __typename?: 'Mutations', deliveredProduct?: { __typename?: 'DeliveredProduct', order?: { __typename?: 'OrderType', id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { __typename?: 'ProductType', id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string } } | null } | null };

export type ProductQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type ProductQuery = { __typename?: 'Queries', product?: { __typename?: 'ProductType', id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean } | null };

export type ProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductsQuery = { __typename?: 'Queries', products?: Array<{ __typename?: 'ProductType', id: string, name: string, price: number, description: string, maxBuyableQuantity: number, shopItem: boolean }> | null };

export type UserOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type UserOrdersQuery = { __typename?: 'Queries', userOrders?: Array<{ __typename?: 'OrderType', id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { __typename?: 'ProductType', id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string } }> | null };

export type AllUserOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUserOrdersQuery = { __typename?: 'Queries', allUserOrders?: Array<{ __typename?: 'OrderType', id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { __typename?: 'ProductType', id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string } }> | null };

export type PaginatedShopOrdersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PaginatedShopOrdersQuery = { __typename?: 'Queries', paginatedShopOrders?: Array<{ __typename?: 'OrderType', id: string, quantity: number, totalPrice: number, paymentStatus: PaymentStatus, timestamp: string, deliveredProduct: boolean, product: { __typename?: 'ProductType', id: string, name: string, description: string, price: number, maxBuyableQuantity: number, shopItem: boolean }, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string } }> | null };

export type EventFieldsFragment = { __typename?: 'EventType', id: string, title: string, startTime: string, shortDescription?: string | null, allowedGradeYears?: Array<number> | null, isFull?: boolean | null, isAttendable: boolean, signupOpenDate?: string | null, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null } | null, organization: { __typename?: 'OrganizationType', id: string, color?: string | null } };

export type EventDetailFieldsFragment = { __typename?: 'EventType', id: string, title: string, description: string, shortDescription?: string | null, startTime: string, endTime?: string | null, location?: string | null, contactEmail: string, allowedGradeYears?: Array<number> | null, hasExtraInformation: boolean, isFull?: boolean | null, signupOpenDate?: string | null, deadline?: string | null, isAttendable: boolean, bindingSignup: boolean, price?: number | null, product?: { __typename?: 'ProductType', id: string } | null, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null, positionOnWaitingList?: number | null, hasBoughtTicket?: boolean | null } | null, category?: { __typename?: 'CategoryType', id: string, name: string } | null, organization: { __typename?: 'OrganizationType', id: string, name: string, logoUrl?: string | null } };

export type AdminEventFragment = { __typename?: 'EventType', id: string, title: string, startTime: string, endTime?: string | null, location?: string | null, description: string, image?: string | null, isAttendable: boolean, deadline?: string | null, availableSlots?: number | null, price?: number | null, shortDescription?: string | null, signupOpenDate?: string | null, isFull?: boolean | null, hasExtraInformation: boolean, bindingSignup: boolean, contactEmail: string, allowedGradeYears?: Array<number> | null, organization: { __typename?: 'OrganizationType', id: string, name: string }, category?: { __typename?: 'CategoryType', id: string, name: string } | null, publisher?: { __typename?: 'UserType', id: string, username: string, email: string, firstName: string, lastName: string, dateJoined: string } | null, usersAttending?: Array<{ __typename?: 'SignUpType', userEmail: string, userGradeYear: number, userAllergies?: string | null, userPhoneNumber: string, extraInformation: string, hasBoughtTicket?: boolean | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string } }> | null, usersOnWaitingList?: Array<{ __typename?: 'SignUpType', userEmail: string, userGradeYear: number, userAllergies?: string | null, userPhoneNumber: string, extraInformation: string, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string } }> | null, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null } | null, product?: { __typename?: 'ProductType', id: string } | null };

export type SignUpFragment = { __typename?: 'SignUpType', userEmail: string, userGradeYear: number, userAllergies?: string | null, userPhoneNumber: string, extraInformation: string, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string } };

export type SignUpWithTicketFragment = { __typename?: 'SignUpType', userEmail: string, userGradeYear: number, userAllergies?: string | null, userPhoneNumber: string, extraInformation: string, hasBoughtTicket?: boolean | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string } };

export type CreateEventMutationVariables = Exact<{
  eventData: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutations', createEvent?: { __typename?: 'CreateEvent', ok?: boolean | null, event?: { __typename?: 'EventType', id: string, title: string, startTime: string, shortDescription?: string | null, allowedGradeYears?: Array<number> | null, isFull?: boolean | null, isAttendable: boolean, signupOpenDate?: string | null, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null } | null, organization: { __typename?: 'OrganizationType', id: string, color?: string | null } } | null } | null };

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  eventData: UpdateEventInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutations', updateEvent?: { __typename?: 'UpdateEvent', ok?: boolean | null, event?: { __typename?: 'EventType', id: string, title: string, description: string, shortDescription?: string | null, startTime: string, endTime?: string | null, location?: string | null, contactEmail: string, allowedGradeYears?: Array<number> | null, hasExtraInformation: boolean, isFull?: boolean | null, signupOpenDate?: string | null, deadline?: string | null, isAttendable: boolean, bindingSignup: boolean, price?: number | null, product?: { __typename?: 'ProductType', id: string } | null, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null, positionOnWaitingList?: number | null, hasBoughtTicket?: boolean | null } | null, category?: { __typename?: 'CategoryType', id: string, name: string } | null, organization: { __typename?: 'OrganizationType', id: string, name: string, logoUrl?: string | null } } | null } | null };

export type EventSignUpMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  extraInformation?: InputMaybe<Scalars['String']['input']>;
}>;


export type EventSignUpMutation = { __typename?: 'Mutations', eventSignUp?: { __typename?: 'EventSignUp', isFull?: boolean | null, event?: { __typename?: 'EventType', id: string, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null, positionOnWaitingList?: number | null } | null } | null } | null };

export type EventSignOffMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type EventSignOffMutation = { __typename?: 'Mutations', eventSignOff?: { __typename?: 'EventSignOff', isFull?: boolean | null, event?: { __typename?: 'EventType', id: string, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null, positionOnWaitingList?: number | null } | null } | null } | null };

export type AdminEventSignOffMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type AdminEventSignOffMutation = { __typename?: 'Mutations', adminEventSignOff?: { __typename?: 'AdminEventSignOff', event?: { __typename?: 'EventType', id: string } | null } | null };

export type SendEventMailsMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  receiverEmails?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
}>;


export type SendEventMailsMutation = { __typename?: 'Mutations', sendEventMails?: { __typename?: 'SendEventEmails', ok?: boolean | null } | null };

export type EventsQueryVariables = Exact<{
  organization?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type EventsQuery = { __typename?: 'Queries', hasPermission?: boolean | null, allEvents?: Array<{ __typename?: 'EventType', id: string, title: string, startTime: string, shortDescription?: string | null, allowedGradeYears?: Array<number> | null, isFull?: boolean | null, isAttendable: boolean, signupOpenDate?: string | null, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null } | null, organization: { __typename?: 'OrganizationType', id: string, color?: string | null } }> | null, defaultEvents?: Array<{ __typename?: 'EventType', id: string, title: string, startTime: string, shortDescription?: string | null, allowedGradeYears?: Array<number> | null, isFull?: boolean | null, isAttendable: boolean, signupOpenDate?: string | null, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null } | null, organization: { __typename?: 'OrganizationType', id: string, color?: string | null } }> | null, user?: { __typename?: 'UserType', id: string, gradeYear?: number | null } | null };

export type EventDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EventDetailsQuery = { __typename?: 'Queries', event?: { __typename?: 'EventType', id: string, title: string, description: string, shortDescription?: string | null, startTime: string, endTime?: string | null, location?: string | null, contactEmail: string, allowedGradeYears?: Array<number> | null, hasExtraInformation: boolean, isFull?: boolean | null, signupOpenDate?: string | null, deadline?: string | null, isAttendable: boolean, bindingSignup: boolean, price?: number | null, product?: { __typename?: 'ProductType', id: string } | null, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null, positionOnWaitingList?: number | null, hasBoughtTicket?: boolean | null } | null, category?: { __typename?: 'CategoryType', id: string, name: string } | null, organization: { __typename?: 'OrganizationType', id: string, name: string, logoUrl?: string | null } } | null, user?: { __typename?: 'UserType', id: string, gradeYear?: number | null, organizations: Array<{ __typename?: 'OrganizationType', id: string }> } | null };

export type AllCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCategoriesQuery = { __typename?: 'Queries', allCategories?: Array<{ __typename?: 'CategoryType', id: string, name: string }> | null };

export type EventFilteredOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventFilteredOrganizationsQuery = { __typename?: 'Queries', eventFilteredOrganizations?: Array<{ __typename?: 'OrganizationType', id: string, name: string, color?: string | null, children: Array<{ __typename?: 'OrganizationType', id: string, name: string }> }> | null };

export type AdminEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AdminEventQuery = { __typename?: 'Queries', event?: { __typename?: 'EventType', id: string, title: string, startTime: string, endTime?: string | null, location?: string | null, description: string, image?: string | null, isAttendable: boolean, deadline?: string | null, availableSlots?: number | null, price?: number | null, shortDescription?: string | null, signupOpenDate?: string | null, isFull?: boolean | null, hasExtraInformation: boolean, bindingSignup: boolean, contactEmail: string, allowedGradeYears?: Array<number> | null, organization: { __typename?: 'OrganizationType', id: string, name: string }, category?: { __typename?: 'CategoryType', id: string, name: string } | null, publisher?: { __typename?: 'UserType', id: string, username: string, email: string, firstName: string, lastName: string, dateJoined: string } | null, usersAttending?: Array<{ __typename?: 'SignUpType', userEmail: string, userGradeYear: number, userAllergies?: string | null, userPhoneNumber: string, extraInformation: string, hasBoughtTicket?: boolean | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string } }> | null, usersOnWaitingList?: Array<{ __typename?: 'SignUpType', userEmail: string, userGradeYear: number, userAllergies?: string | null, userPhoneNumber: string, extraInformation: string, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string } }> | null, userAttendance?: { __typename?: 'UserAttendingType', isSignedUp?: boolean | null, isOnWaitingList?: boolean | null } | null, product?: { __typename?: 'ProductType', id: string } | null } | null };

export type EventSignUpsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EventSignUpsQuery = { __typename?: 'Queries', event?: { __typename?: 'EventType', isAttendable: boolean, usersAttending?: Array<{ __typename?: 'SignUpType', userEmail: string }> | null } | null };

export type AttendeeReportQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  filetype?: InputMaybe<Scalars['String']['input']>;
}>;


export type AttendeeReportQuery = { __typename?: 'Queries', attendeeReport?: string | null };

export type AttendeeReportOrgQueryVariables = Exact<{
  orgId: Scalars['ID']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  filetype?: InputMaybe<Scalars['String']['input']>;
}>;


export type AttendeeReportOrgQuery = { __typename?: 'Queries', attendeeReportOrg?: string | null };

export type AttendeeReportsQueryVariables = Exact<{
  eventIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  fields?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  filetype?: InputMaybe<Scalars['String']['input']>;
}>;


export type AttendeeReportsQuery = { __typename?: 'Queries', attendeeReports?: string | null };

export type EventUserOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventUserOrganizationsQuery = { __typename?: 'Queries', user?: { __typename?: 'UserType', id: string, organizations: Array<{ __typename?: 'OrganizationType', id: string }> } | null };

export type FormFragment = { __typename?: 'FormType', id: string, name: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }> };

export type FormWithAnswersFragment = { __typename?: 'FormType', id: string, name: string, description: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answer?: { __typename?: 'AnswerType', id?: string | null, answer: string } | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }> };

export type FormWithAllResponsesFragment = { __typename?: 'FormType', id: string, name: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answers?: Array<{ __typename?: 'AnswerType', id?: string | null }> | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }>, responses?: Array<{ __typename?: 'ResponseType', id?: string | null, respondent: { __typename?: 'UserType', id: string, firstName: string, lastName: string }, answers: Array<{ __typename?: 'AnswerType', id?: string | null, answer: string, question: { __typename?: 'QuestionType', id: string } }> }> | null };

export type ResponseFragment = { __typename?: 'ResponseType', id?: string | null, respondent: { __typename?: 'UserType', id: string, firstName: string, lastName: string }, answers: Array<{ __typename?: 'AnswerType', id?: string | null, answer: string, question: { __typename?: 'QuestionType', id: string } }> };

export type QuestionFragment = { __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null };

export type QuestionWithAnswerFragment = { __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answer?: { __typename?: 'AnswerType', id?: string | null, answer: string } | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null };

export type QuestionWithAnswerIdsFragment = { __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answers?: Array<{ __typename?: 'AnswerType', id?: string | null }> | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null };

export type OptionFragment = { __typename?: 'OptionType', id: string, answer: string };

export type AnswerFragment = { __typename?: 'AnswerType', id?: string | null, answer: string };

export type AnswerWithQuestionIdFragment = { __typename?: 'AnswerType', id?: string | null, answer: string, question: { __typename?: 'QuestionType', id: string } };

export type CreateFormMutationVariables = Exact<{
  formData: CreateFormInput;
  listingId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateFormMutation = { __typename?: 'Mutations', createForm?: { __typename?: 'CreateForm', ok?: boolean | null, form?: { __typename?: 'FormType', id: string, name: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answers?: Array<{ __typename?: 'AnswerType', id?: string | null }> | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }>, responses?: Array<{ __typename?: 'ResponseType', id?: string | null, respondent: { __typename?: 'UserType', id: string, firstName: string, lastName: string }, answers: Array<{ __typename?: 'AnswerType', id?: string | null, answer: string, question: { __typename?: 'QuestionType', id: string } }> }> | null } | null } | null };

export type UpdateFormMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  formData: BaseFormInput;
}>;


export type UpdateFormMutation = { __typename?: 'Mutations', updateForm?: { __typename?: 'UpdateForm', ok?: boolean | null, form?: { __typename?: 'FormType', id: string, name: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answers?: Array<{ __typename?: 'AnswerType', id?: string | null }> | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }>, responses?: Array<{ __typename?: 'ResponseType', id?: string | null, respondent: { __typename?: 'UserType', id: string, firstName: string, lastName: string }, answers: Array<{ __typename?: 'AnswerType', id?: string | null, answer: string, question: { __typename?: 'QuestionType', id: string } }> }> | null } | null } | null };

export type CreateQuestionMutationVariables = Exact<{
  formId: Scalars['ID']['input'];
  questionData: CreateQuestionInput;
}>;


export type CreateQuestionMutation = { __typename?: 'Mutations', createQuestion?: { __typename?: 'CreateQuestion', ok?: boolean | null, question?: { __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answers?: Array<{ __typename?: 'AnswerType', id?: string | null }> | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null } | null } | null };

export type UpdateQuestionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  questionData: BaseQuestionInput;
  optionData?: InputMaybe<Array<OptionInput> | OptionInput>;
}>;


export type UpdateQuestionMutation = { __typename?: 'Mutations', createUpdateAndDeleteOptions?: { __typename?: 'CreateUpdateAndDeleteOptions', ok?: boolean | null } | null, updateQuestion?: { __typename?: 'UpdateQuestion', ok?: boolean | null, question?: { __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answers?: Array<{ __typename?: 'AnswerType', id?: string | null }> | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null } | null } | null };

export type DeleteQuestionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteQuestionMutation = { __typename?: 'Mutations', deleteQuestion?: { __typename?: 'DeleteQuestion', deletedId?: string | null, ok?: boolean | null } | null };

export type SubmitAnswersMutationVariables = Exact<{
  formId: Scalars['ID']['input'];
  answersData?: InputMaybe<Array<AnswerInput> | AnswerInput>;
}>;


export type SubmitAnswersMutation = { __typename?: 'Mutations', submitAnswers?: { __typename?: 'SubmitOrUpdateAnswers', ok?: boolean | null, message?: string | null } | null };

export type FormWithAllResponsesQueryVariables = Exact<{
  formId: Scalars['ID']['input'];
}>;


export type FormWithAllResponsesQuery = { __typename?: 'Queries', form?: { __typename?: 'FormType', id: string, name: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answers?: Array<{ __typename?: 'AnswerType', id?: string | null }> | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }>, responses?: Array<{ __typename?: 'ResponseType', id?: string | null, respondent: { __typename?: 'UserType', id: string, firstName: string, lastName: string }, answers: Array<{ __typename?: 'AnswerType', id?: string | null, answer: string, question: { __typename?: 'QuestionType', id: string } }> }> | null } | null };

export type FormWithAnswersQueryVariables = Exact<{
  formId: Scalars['ID']['input'];
}>;


export type FormWithAnswersQuery = { __typename?: 'Queries', form?: { __typename?: 'FormType', id: string, name: string, description: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answer?: { __typename?: 'AnswerType', id?: string | null, answer: string } | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }> } | null };

export type JanHusGuestListEntryFragment = { __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string };

export type JanHusBookingAvailabilityFragment = { __typename?: 'JanHusBookingType', id: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, area: { __typename?: 'JanHusAreaType', id: string, name: string } };

export type JanHusBookingFragment = { __typename?: 'JanHusBookingType', id: string, reference: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, occasion: string, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount?: number | null, comment: string, bookerMessage: string, requestedAt?: string | null, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices, totalPrice?: number | null, durationMinutes?: number | null, priceOverrideTier?: JanhusJanHusBookingPriceOverrideTierChoices | null, priceOverrideAmount?: number | null, manuallyMarkedAsPaid: boolean, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, ownerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, bookerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, responsibleUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, guestListEntries?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null, vippsProduct?: { __typename?: 'ProductType', id: string, name: string, price: number } | null, vippsOrder?: { __typename?: 'OrderType', id: string, paymentStatus: PaymentStatus } | null };

export type JanHusAdminBookingFragment = { __typename?: 'JanHusBookingType', adminComment: string, doorAccessWarnings: Array<string>, id: string, reference: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, occasion: string, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount?: number | null, comment: string, bookerMessage: string, requestedAt?: string | null, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices, totalPrice?: number | null, durationMinutes?: number | null, priceOverrideTier?: JanhusJanHusBookingPriceOverrideTierChoices | null, priceOverrideAmount?: number | null, manuallyMarkedAsPaid: boolean, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, ownerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, bookerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, responsibleUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, guestListEntries?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null, vippsProduct?: { __typename?: 'ProductType', id: string, name: string, price: number } | null, vippsOrder?: { __typename?: 'OrderType', id: string, paymentStatus: PaymentStatus } | null };

export type JanHusBookingRequestFragment = { __typename?: 'JanHusBookingRequestType', id: string, reference: string, startsAt: string, endsAt: string, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, occasion: string, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, bookerMessage: string, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, requesterUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, convertedBooking?: { __typename?: 'JanHusBookingType', id: string, status: JanhusJanHusBookingStatusChoices } | null };

export type JanHusAdminBookingRequestFragment = { __typename?: 'JanHusBookingRequestType', adminComment: string, id: string, reference: string, startsAt: string, endsAt: string, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, occasion: string, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, bookerMessage: string, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, requesterUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, convertedBooking?: { __typename?: 'JanHusBookingType', id: string, status: JanhusJanHusBookingStatusChoices } | null };

export type JanHusBookingSettingsFragment = { __typename?: 'JanHusBookingSettingsType', id: string, minDurationMinutes: number, slotGranularityMinutes: number, openingHour: number, closingHour: number, bufferMinutes: number, organizationBookingOpensWeeksBefore: number, generalBookingOpensWeeksBefore: number, fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean, externalBookingsEnabled: boolean, privateBookingsEnabled: boolean, cleaningOptionEnabled: boolean, guidelinesUrl?: string | null, guidelinesTitle?: string | null };

export type JanHusAreaFragment = { __typename?: 'JanHusAreaType', id: string, name: string, isActive: boolean, internalPricePerHour: number, externalPricePerHour: number, cleaningFee: number, defaultDepositAmount: number, conflictingAreaIds?: Array<string> | null, parent?: { __typename?: 'JanHusAreaType', id: string, name: string } | null };

export type CreateJanhusBookingMutationVariables = Exact<{
  bookingData: JanHusBookingInput;
}>;


export type CreateJanhusBookingMutation = { __typename?: 'Mutations', createJanhusBooking?: { __typename?: 'CreateJanHusBooking', ok?: boolean | null, booking?: { __typename?: 'JanHusBookingType', id: string, reference: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, occasion: string, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount?: number | null, comment: string, bookerMessage: string, requestedAt?: string | null, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices, totalPrice?: number | null, durationMinutes?: number | null, priceOverrideTier?: JanhusJanHusBookingPriceOverrideTierChoices | null, priceOverrideAmount?: number | null, manuallyMarkedAsPaid: boolean, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, ownerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, bookerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, responsibleUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, guestListEntries?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null, vippsProduct?: { __typename?: 'ProductType', id: string, name: string, price: number } | null, vippsOrder?: { __typename?: 'OrderType', id: string, paymentStatus: PaymentStatus } | null } | null } | null };

export type UpdateJanhusBookingMutationVariables = Exact<{
  bookingData: UpdateJanHusBookingInput;
}>;


export type UpdateJanhusBookingMutation = { __typename?: 'Mutations', updateJanhusBooking?: { __typename?: 'UpdateJanHusBooking', ok?: boolean | null, booking?: { __typename?: 'JanHusBookingType', id: string, reference: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, occasion: string, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount?: number | null, comment: string, bookerMessage: string, requestedAt?: string | null, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices, totalPrice?: number | null, durationMinutes?: number | null, priceOverrideTier?: JanhusJanHusBookingPriceOverrideTierChoices | null, priceOverrideAmount?: number | null, manuallyMarkedAsPaid: boolean, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, ownerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, bookerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, responsibleUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, guestListEntries?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null, vippsProduct?: { __typename?: 'ProductType', id: string, name: string, price: number } | null, vippsOrder?: { __typename?: 'OrderType', id: string, paymentStatus: PaymentStatus } | null } | null, overlappingBookings?: Array<{ __typename?: 'JanHusBookingType', id: string, reference: string, startsAt: string, endsAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string } }> | null } | null };

export type ReviewJanhusBookingMutationVariables = Exact<{
  reviewData: ReviewJanHusBookingInput;
}>;


export type ReviewJanhusBookingMutation = { __typename?: 'Mutations', reviewJanhusBooking?: { __typename?: 'ReviewJanHusBooking', ok?: boolean | null, booking?: { __typename?: 'JanHusBookingType', id: string, reference: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, occasion: string, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount?: number | null, comment: string, bookerMessage: string, requestedAt?: string | null, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices, totalPrice?: number | null, durationMinutes?: number | null, priceOverrideTier?: JanhusJanHusBookingPriceOverrideTierChoices | null, priceOverrideAmount?: number | null, manuallyMarkedAsPaid: boolean, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, ownerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, bookerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, responsibleUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, guestListEntries?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null, vippsProduct?: { __typename?: 'ProductType', id: string, name: string, price: number } | null, vippsOrder?: { __typename?: 'OrderType', id: string, paymentStatus: PaymentStatus } | null } | null } | null };

export type CreateJanhusBookingRequestMutationVariables = Exact<{
  requestData: JanHusBookingRequestInput;
}>;


export type CreateJanhusBookingRequestMutation = { __typename?: 'Mutations', createJanhusBookingRequest?: { __typename?: 'CreateJanHusBookingRequest', ok?: boolean | null, bookingRequest?: { __typename?: 'JanHusBookingRequestType', id: string, reference: string, startsAt: string, endsAt: string, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, occasion: string, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, bookerMessage: string, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, requesterUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, convertedBooking?: { __typename?: 'JanHusBookingType', id: string, status: JanhusJanHusBookingStatusChoices } | null } | null } | null };

export type ReviewJanhusBookingRequestMutationVariables = Exact<{
  reviewData: ReviewJanHusBookingRequestInput;
}>;


export type ReviewJanhusBookingRequestMutation = { __typename?: 'Mutations', reviewJanhusBookingRequest?: { __typename?: 'ReviewJanHusBookingRequest', ok?: boolean | null, bookingRequest?: { __typename?: 'JanHusBookingRequestType', id: string, reference: string, startsAt: string, endsAt: string, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, occasion: string, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, bookerMessage: string, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, requesterUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, convertedBooking?: { __typename?: 'JanHusBookingType', id: string, status: JanhusJanHusBookingStatusChoices } | null } | null, booking?: { __typename?: 'JanHusBookingType', id: string, reference: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, occasion: string, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount?: number | null, comment: string, bookerMessage: string, requestedAt?: string | null, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices, totalPrice?: number | null, durationMinutes?: number | null, priceOverrideTier?: JanhusJanHusBookingPriceOverrideTierChoices | null, priceOverrideAmount?: number | null, manuallyMarkedAsPaid: boolean, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, ownerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, bookerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, responsibleUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, guestListEntries?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null, vippsProduct?: { __typename?: 'ProductType', id: string, name: string, price: number } | null, vippsOrder?: { __typename?: 'OrderType', id: string, paymentStatus: PaymentStatus } | null } | null, overlappingBookings?: Array<{ __typename?: 'JanHusBookingType', id: string, reference: string, startsAt: string, endsAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string } }> | null } | null };

export type UpdateJanhusBookingSettingsMutationVariables = Exact<{
  settingsData: JanHusBookingSettingsInput;
}>;


export type UpdateJanhusBookingSettingsMutation = { __typename?: 'Mutations', updateJanhusBookingSettings?: { __typename?: 'UpdateJanHusBookingSettings', ok?: boolean | null, bookingSettings?: { __typename?: 'JanHusBookingSettingsType', id: string, minDurationMinutes: number, slotGranularityMinutes: number, openingHour: number, closingHour: number, bufferMinutes: number, organizationBookingOpensWeeksBefore: number, generalBookingOpensWeeksBefore: number, fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean, externalBookingsEnabled: boolean, privateBookingsEnabled: boolean, cleaningOptionEnabled: boolean, guidelinesUrl?: string | null, guidelinesTitle?: string | null } | null } | null };

export type UpdateJanhusAreaMutationVariables = Exact<{
  areaData: UpdateJanHusAreaInput;
}>;


export type UpdateJanhusAreaMutation = { __typename?: 'Mutations', updateJanhusArea?: { __typename?: 'UpdateJanHusArea', ok?: boolean | null, area?: { __typename?: 'JanHusAreaType', id: string, name: string, isActive: boolean, internalPricePerHour: number, externalPricePerHour: number, cleaningFee: number, defaultDepositAmount: number, conflictingAreaIds?: Array<string> | null, parent?: { __typename?: 'JanHusAreaType', id: string, name: string } | null } | null } | null };

export type CreateJanhusPaymentProductMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
}>;


export type CreateJanhusPaymentProductMutation = { __typename?: 'Mutations', createJanhusPaymentProduct?: { __typename?: 'CreateJanHusPaymentProduct', ok?: boolean | null, productId?: string | null, booking?: { __typename?: 'JanHusBookingType', id: string, reference: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, occasion: string, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount?: number | null, comment: string, bookerMessage: string, requestedAt?: string | null, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices, totalPrice?: number | null, durationMinutes?: number | null, priceOverrideTier?: JanhusJanHusBookingPriceOverrideTierChoices | null, priceOverrideAmount?: number | null, manuallyMarkedAsPaid: boolean, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, ownerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, bookerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, responsibleUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, guestListEntries?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null, vippsProduct?: { __typename?: 'ProductType', id: string, name: string, price: number } | null, vippsOrder?: { __typename?: 'OrderType', id: string, paymentStatus: PaymentStatus } | null } | null } | null };

export type DeleteJanhusBookingMutationVariables = Exact<{
  bookingId: Scalars['ID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteJanhusBookingMutation = { __typename?: 'Mutations', deleteJanhusBooking?: { __typename?: 'DeleteJanHusBooking', ok?: boolean | null } | null };

export type DeleteJanhusBookingRequestMutationVariables = Exact<{
  requestId: Scalars['ID']['input'];
}>;


export type DeleteJanhusBookingRequestMutation = { __typename?: 'Mutations', deleteJanhusBookingRequest?: { __typename?: 'DeleteJanHusBookingRequest', ok?: boolean | null } | null };

export type JanHusBookingsQueryVariables = Exact<{
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  area?: InputMaybe<Scalars['ID']['input']>;
}>;


export type JanHusBookingsQuery = { __typename?: 'Queries', janhusBookings?: Array<{ __typename?: 'JanHusBookingType', id: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, area: { __typename?: 'JanHusAreaType', id: string, name: string } }> | null };

export type JanHusBookingCalendarQueryVariables = Exact<{
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type JanHusBookingCalendarQuery = { __typename?: 'Queries', janhusBookings?: Array<{ __typename?: 'JanHusBookingType', ownerDisplayName?: string | null, id: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, area: { __typename?: 'JanHusAreaType', id: string, name: string } }> | null };

export type JanHusMyBookingsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusMyBookingsQuery = { __typename?: 'Queries', janhusMyBookings?: Array<{ __typename?: 'JanHusBookingType', id: string, reference: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, occasion: string, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount?: number | null, comment: string, bookerMessage: string, requestedAt?: string | null, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices, totalPrice?: number | null, durationMinutes?: number | null, priceOverrideTier?: JanhusJanHusBookingPriceOverrideTierChoices | null, priceOverrideAmount?: number | null, manuallyMarkedAsPaid: boolean, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, ownerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, bookerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, responsibleUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, guestListEntries?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null, vippsProduct?: { __typename?: 'ProductType', id: string, name: string, price: number } | null, vippsOrder?: { __typename?: 'OrderType', id: string, paymentStatus: PaymentStatus } | null }> | null };

export type JanHusMyBookingRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusMyBookingRequestsQuery = { __typename?: 'Queries', janhusMyBookingRequests?: Array<{ __typename?: 'JanHusBookingRequestType', id: string, reference: string, startsAt: string, endsAt: string, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, occasion: string, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, bookerMessage: string, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, requesterUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, convertedBooking?: { __typename?: 'JanHusBookingType', id: string, status: JanhusJanHusBookingStatusChoices } | null }> | null };

export type JanHusGuestSearchQueryVariables = Exact<{
  bookingId: Scalars['ID']['input'];
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type JanHusGuestSearchQuery = { __typename?: 'Queries', janhusGuestSearch?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null };

export type JanHusGuestSearchForRequestQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type JanHusGuestSearchForRequestQuery = { __typename?: 'Queries', janhusGuestSearchForRequest?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null };

export type AdminJanHusBookingsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type AdminJanHusBookingsQuery = { __typename?: 'Queries', adminJanhusBookings?: Array<{ __typename?: 'JanHusBookingType', adminComment: string, doorAccessWarnings: Array<string>, id: string, reference: string, startsAt: string, endsAt: string, status: JanhusJanHusBookingStatusChoices, isExternalBooking: boolean, bookerName: string, bookerEmail: string, bookerPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingEventTypeChoices, cleaningRequested: boolean, occasion: string, depositStatus: JanhusJanHusBookingDepositStatusChoices, depositAmount: number, outstandingDepositAmount?: number | null, comment: string, bookerMessage: string, requestedAt?: string | null, guestList: string, doorAccessPolicy: JanhusJanHusBookingDoorAccessPolicyChoices, organizationDoorAccess: JanhusJanHusBookingOrganizationDoorAccessChoices, totalPrice?: number | null, durationMinutes?: number | null, priceOverrideTier?: JanhusJanHusBookingPriceOverrideTierChoices | null, priceOverrideAmount?: number | null, manuallyMarkedAsPaid: boolean, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, ownerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, bookerUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, responsibleUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, guestListEntries?: Array<{ __typename?: 'JanHusGuestListEntryType', feideUserid: string, displayName: string }> | null, vippsProduct?: { __typename?: 'ProductType', id: string, name: string, price: number } | null, vippsOrder?: { __typename?: 'OrderType', id: string, paymentStatus: PaymentStatus } | null }> | null };

export type JanHusBookerDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusBookerDetailsQuery = { __typename?: 'Queries', user?: { __typename?: 'UserType', id: string, firstName: string, lastName: string, email: string, feideEmail: string, phoneNumber: string } | null };

export type JanHusUserSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type JanHusUserSearchQuery = { __typename?: 'Queries', janhusUserSearch?: Array<{ __typename?: 'JanHusUserSearchResultType', id: string, displayName: string, email: string }> | null };

export type JanHusBookableOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusBookableOrganizationsQuery = { __typename?: 'Queries', janhusBookableOrganizations?: Array<{ __typename?: 'OrganizationType', id: string, name: string }> | null };

export type JanHusContractPreviewQueryVariables = Exact<{
  contractData: JanHusContractPreviewInput;
}>;


export type JanHusContractPreviewQuery = { __typename?: 'Queries', janhusContractPreview?: string | null };

export type JanHusContractSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusContractSettingsQuery = { __typename?: 'Queries', janhusBookingSettings?: { __typename?: 'JanHusBookingSettingsType', id: string, keyBoxCode?: string | null, bookingContactName: string, bookingContactPhone: string, contractAddress: string, contractRentAmount: number, contractMaxFee: number, contractCleaningDeadlineHours: number } | null };

export type JanHusBookingSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusBookingSettingsQuery = { __typename?: 'Queries', janhusBookingSettings?: { __typename?: 'JanHusBookingSettingsType', id: string, minDurationMinutes: number, slotGranularityMinutes: number, openingHour: number, closingHour: number, bufferMinutes: number, organizationBookingOpensWeeksBefore: number, generalBookingOpensWeeksBefore: number, fallStartDate: string, fallEndDate: string, springStartDate: string, springEndDate: string, fallSemesterActive: boolean, springSemesterActive: boolean, externalBookingsEnabled: boolean, privateBookingsEnabled: boolean, cleaningOptionEnabled: boolean, guidelinesUrl?: string | null, guidelinesTitle?: string | null } | null };

export type JanHusAreasQueryVariables = Exact<{
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type JanHusAreasQuery = { __typename?: 'Queries', janhusAreas?: Array<{ __typename?: 'JanHusAreaType', id: string, name: string, isActive: boolean, internalPricePerHour: number, externalPricePerHour: number, cleaningFee: number, defaultDepositAmount: number, conflictingAreaIds?: Array<string> | null, parent?: { __typename?: 'JanHusAreaType', id: string, name: string } | null }> | null };

export type JanHusBookingRequestsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type JanHusBookingRequestsQuery = { __typename?: 'Queries', janhusBookingRequests?: Array<{ __typename?: 'JanHusBookingRequestType', adminComment: string, id: string, reference: string, startsAt: string, endsAt: string, requesterName: string, requesterEmail: string, requesterPhone: string, responsibleName: string, responsibleEmail: string, responsiblePhone: string, eventType: JanhusJanHusBookingRequestEventTypeChoices, cleaningRequested: boolean, occasion: string, comment: string, guestList: string, status: JanhusJanHusBookingRequestStatusChoices, bookerMessage: string, createdAt: string, updatedAt: string, area: { __typename?: 'JanHusAreaType', id: string, name: string }, requesterUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null, ownerOrganization?: { __typename?: 'OrganizationType', id: string, name: string } | null, convertedBooking?: { __typename?: 'JanHusBookingType', id: string, status: JanhusJanHusBookingStatusChoices } | null }> | null };

export type JanHusAdminAccessQueryVariables = Exact<{ [key: string]: never; }>;


export type JanHusAdminAccessQuery = { __typename?: 'Queries', canManage?: boolean | null, canView?: boolean | null, canViewDoorLog?: boolean | null };

export type ListingFragment = { __typename?: 'ListingType', id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl?: string | null, chips: Array<string>, readMoreUrl?: string | null, heroImageUrl?: string | null, organization: { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string } };

export type ListingOrganizationFragment = { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string };

export type ListingWithFormIdFragment = { __typename?: 'ListingType', id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl?: string | null, chips: Array<string>, readMoreUrl?: string | null, heroImageUrl?: string | null, form?: { __typename?: 'FormType', id: string } | null, organization: { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string } };

export type ListingWithFormFragment = { __typename?: 'ListingType', id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl?: string | null, chips: Array<string>, readMoreUrl?: string | null, heroImageUrl?: string | null, form?: { __typename?: 'FormType', id: string, name: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }> } | null, organization: { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string } };

export type ListingWithResponsesFragment = { __typename?: 'ListingType', id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl?: string | null, chips: Array<string>, readMoreUrl?: string | null, heroImageUrl?: string | null, form?: { __typename?: 'FormType', id: string, name: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answers?: Array<{ __typename?: 'AnswerType', id?: string | null }> | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }>, responses?: Array<{ __typename?: 'ResponseType', id?: string | null, respondent: { __typename?: 'UserType', id: string, firstName: string, lastName: string }, answers: Array<{ __typename?: 'AnswerType', id?: string | null, answer: string, question: { __typename?: 'QuestionType', id: string } }> }> | null } | null, organization: { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string } };

export type CreateListingMutationVariables = Exact<{
  input: CreateListingInput;
}>;


export type CreateListingMutation = { __typename?: 'Mutations', createListing?: { __typename?: 'CreateListing', ok?: boolean | null, listing?: { __typename?: 'ListingType', id: string, slug: string } | null } | null };

export type UpdateListingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input?: InputMaybe<BaseListingInput>;
}>;


export type UpdateListingMutation = { __typename?: 'Mutations', updateListing?: { __typename?: 'UpdateListing', ok?: boolean | null, listing?: { __typename?: 'ListingType', id: string, slug: string } | null } | null };

export type DeleteListingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteListingMutation = { __typename?: 'Mutations', deleteListing?: { __typename?: 'DeleteListing', listingId?: string | null, ok?: boolean | null } | null };

export type ListingQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ListingQuery = { __typename?: 'Queries', listing?: { __typename?: 'ListingType', id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl?: string | null, chips: Array<string>, readMoreUrl?: string | null, heroImageUrl?: string | null, form?: { __typename?: 'FormType', id: string } | null, organization: { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string } } | null };

export type ListingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListingsQuery = { __typename?: 'Queries', listings?: Array<{ __typename?: 'ListingType', id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl?: string | null, chips: Array<string>, readMoreUrl?: string | null, heroImageUrl?: string | null, organization: { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string } }> | null };

export type ListingWithFormQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ListingWithFormQuery = { __typename?: 'Queries', listing?: { __typename?: 'ListingType', id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl?: string | null, chips: Array<string>, readMoreUrl?: string | null, heroImageUrl?: string | null, form?: { __typename?: 'FormType', id: string, name: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }> } | null, organization: { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string } } | null };

export type ListingWithResponsesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ListingWithResponsesQuery = { __typename?: 'Queries', listing?: { __typename?: 'ListingType', id: string, title: string, slug: string, description: string, startDatetime: string, deadline: string, endDatetime: string, applicationUrl?: string | null, chips: Array<string>, readMoreUrl?: string | null, heroImageUrl?: string | null, form?: { __typename?: 'FormType', id: string, name: string, questions: Array<{ __typename?: 'QuestionType', id: string, question: string, description: string, questionType?: QuestionTypeEnum | null, mandatory: boolean, answers?: Array<{ __typename?: 'AnswerType', id?: string | null }> | null, options?: Array<{ __typename?: 'OptionType', id: string, answer: string }> | null }>, responses?: Array<{ __typename?: 'ResponseType', id?: string | null, respondent: { __typename?: 'UserType', id: string, firstName: string, lastName: string }, answers: Array<{ __typename?: 'AnswerType', id?: string | null, answer: string, question: { __typename?: 'QuestionType', id: string } }> }> | null } | null, organization: { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string } } | null };

export type DoorLogQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  result?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['DateTime']['input']>;
  until?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type DoorLogQuery = { __typename?: 'Queries', doorLog?: { __typename?: 'DoorLogPage', total: number, events: Array<{ __typename?: 'DoorLogEventType', id: string, eventType: NfcNfcAccessEventEventTypeChoices, occurredAt: string, doorIdentifier: string, name?: string | null, isWebsiteUser: boolean, holderKind: string, mifareCsnReported: string, cardFormat?: string | null, arxEvent?: string | null }> } | null };

export type AdminOrganizationFragment = { __typename?: 'OrganizationType', id: string, name: string, hrGroup?: { __typename?: 'ResponsibleGroupType', id: string, uuid: string } | null, primaryGroup?: { __typename?: 'ResponsibleGroupType', id: string, uuid: string } | null, events: Array<{ __typename?: 'EventType', id: string, title: string, startTime: string, shortDescription?: string | null, availableSlots?: number | null, isFull?: boolean | null, usersAttending?: Array<{ __typename?: 'SignUpType', id: string }> | null }>, listings?: Array<{ __typename?: 'ListingType', id: string, title: string, deadline: string }> | null };

export type OrgAdminEventFragment = { __typename?: 'EventType', id: string, title: string, startTime: string, shortDescription?: string | null, availableSlots?: number | null, isFull?: boolean | null, usersAttending?: Array<{ __typename?: 'SignUpType', id: string }> | null };

export type OrgAdminListingFragment = { __typename?: 'ListingType', id: string, title: string, deadline: string };

export type MembershipFragment = { __typename?: 'MembershipType', id: string, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string }, group?: { __typename?: 'ResponsibleGroupType', id: string, name: string, uuid: string } | null };

export type MembershipWithOrganizationFragment = { __typename?: 'MembershipType', id: string, organization: { __typename?: 'OrganizationType', id: string, name: string }, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string }, group?: { __typename?: 'ResponsibleGroupType', id: string, name: string, uuid: string } | null };

export type UpsertMembershipMutationVariables = Exact<{
  membershipData: MembershipInput;
}>;


export type UpsertMembershipMutation = { __typename?: 'Mutations', upsertMembership?: { __typename?: 'UpsertMembership', ok?: boolean | null, membership?: { __typename?: 'MembershipType', id: string, organization: { __typename?: 'OrganizationType', id: string, name: string }, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string }, group?: { __typename?: 'ResponsibleGroupType', id: string, name: string, uuid: string } | null } | null } | null };

export type AddMembershipByIdentifierMutationVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  identifier: Scalars['String']['input'];
}>;


export type AddMembershipByIdentifierMutation = { __typename?: 'Mutations', addMembershipByIdentifier?: { __typename?: 'AddMembershipByIdentifier', ok: boolean } | null };

export type RemoveMembershipMutationVariables = Exact<{
  membershipId: Scalars['ID']['input'];
}>;


export type RemoveMembershipMutation = { __typename?: 'Mutations', removeMembership?: { __typename?: 'RemoveMembership', ok?: boolean | null, removedMember?: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string } | null } | null };

export type AdminOrganizationQueryVariables = Exact<{
  orgId: Scalars['ID']['input'];
}>;


export type AdminOrganizationQuery = { __typename?: 'Queries', organization?: { __typename?: 'OrganizationType', id: string, name: string, hrGroup?: { __typename?: 'ResponsibleGroupType', id: string, uuid: string } | null, primaryGroup?: { __typename?: 'ResponsibleGroupType', id: string, uuid: string } | null, events: Array<{ __typename?: 'EventType', id: string, title: string, startTime: string, shortDescription?: string | null, availableSlots?: number | null, isFull?: boolean | null, usersAttending?: Array<{ __typename?: 'SignUpType', id: string }> | null }>, listings?: Array<{ __typename?: 'ListingType', id: string, title: string, deadline: string }> | null } | null };

export type MembershipsQueryVariables = Exact<{
  organizationId: Scalars['ID']['input'];
}>;


export type MembershipsQuery = { __typename?: 'Queries', memberships?: Array<{ __typename?: 'MembershipType', id: string, user: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string }, group?: { __typename?: 'ResponsibleGroupType', id: string, name: string, uuid: string } | null }> | null };

export type AllOrganizationsForAdminEditQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type AllOrganizationsForAdminEditQuery = { __typename?: 'Queries', allOrganizations?: Array<{ __typename?: 'OrganizationType', id: string, name: string, slug: string, primaryGroup?: { __typename?: 'ResponsibleGroupType', id: string, name: string, uuid: string } | null, hrGroup?: { __typename?: 'ResponsibleGroupType', id: string, name: string, uuid: string } | null, permissionGroups?: Array<{ __typename?: 'ResponsibleGroupType', id: string, uuid: string, name: string, groupType: string }> | null }> | null };

export type HasPermissionQueryVariables = Exact<{
  permission: Scalars['String']['input'];
}>;


export type HasPermissionQuery = { __typename?: 'Queries', hasPermission?: boolean | null };

export type UserFragment = { __typename?: 'UserType', id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear?: number | null, gradeYear?: number | null, allergies?: string | null, phoneNumber: string, firstLogin: boolean };

export type UserWithEventsAndOrgsFragment = { __typename?: 'UserType', id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear?: number | null, gradeYear?: number | null, allergies?: string | null, phoneNumber: string, firstLogin: boolean, events?: Array<{ __typename?: 'EventType', id: string }> | null, organizations: Array<{ __typename?: 'OrganizationType', id: string, name: string }> };

export type UserToEditFragment = { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies?: string | null, email: string, graduationYear?: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear?: boolean | null, yearUpdatedAt?: string | null, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null };

export type UserAdminEditFragment = { __typename?: 'UserType', feideUserid: string, gradeYear?: number | null, dateJoined: string, lastLogin?: string | null, id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies?: string | null, email: string, graduationYear?: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear?: boolean | null, yearUpdatedAt?: string | null, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null };

export type UserNfcSearchFragment = { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null };

export type UserNfcDetailFragment = { __typename?: 'UserType', email: string, graduationYear?: number | null, nfcPermanentAccessStatus?: string | null, nfcPermanentAccessEnds?: string | null, nfcNote?: string | null, nfcNoteUpdatedAt?: string | null, nfcNoteUpdatedBy?: string | null, id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null, organizations: Array<{ __typename?: 'OrganizationType', id: string, name: string }> };

export type UserAdminSearchFragment = { __typename?: 'UserType', email: string, phoneNumber: string, allergies?: string | null, graduationYear?: number | null, gradeYear?: number | null, dateJoined: string, lastLogin?: string | null, feideUserid: string, id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null };

export type UserOrganizationFragment = { __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutations', logout?: { __typename?: 'Logout', idToken?: string | null } | null };

export type AuthUserMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type AuthUserMutation = { __typename?: 'Mutations', authUser: { __typename?: 'AuthUser', user: { __typename?: 'UserType', id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear?: number | null, gradeYear?: number | null, allergies?: string | null, phoneNumber: string, firstLogin: boolean } } };

export type UpdateUserMutationVariables = Exact<{
  userData?: InputMaybe<UserInput>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutations', updateUser?: { __typename?: 'UpdateUser', user?: { __typename?: 'UserType', id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear?: number | null, gradeYear?: number | null, allergies?: string | null, phoneNumber: string, firstLogin: boolean } | null } | null };

export type AdminUpdateUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  userData: AdminUserInput;
}>;


export type AdminUpdateUserMutation = { __typename?: 'Mutations', adminUpdateUser?: { __typename?: 'AdminUpdateUser', user?: { __typename?: 'UserType', feideUserid: string, gradeYear?: number | null, dateJoined: string, lastLogin?: string | null, id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies?: string | null, email: string, graduationYear?: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear?: boolean | null, yearUpdatedAt?: string | null, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null } | null } | null };

export type AdminUpdateUserNfcMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  nfcData: AdminUserNfcInput;
}>;


export type AdminUpdateUserNfcMutation = { __typename?: 'Mutations', adminUpdateUserNfc?: { __typename?: 'AdminUpdateUserNfc', user?: { __typename?: 'UserType', feideUserid: string, gradeYear?: number | null, dateJoined: string, lastLogin?: string | null, id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies?: string | null, email: string, graduationYear?: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear?: boolean | null, yearUpdatedAt?: string | null, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null } | null } | null };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Queries', user?: { __typename?: 'UserType', id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear?: number | null, gradeYear?: number | null, allergies?: string | null, phoneNumber: string, firstLogin: boolean } | null };

export type UserWithEventsAndOrgsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserWithEventsAndOrgsQuery = { __typename?: 'Queries', user?: { __typename?: 'UserType', id: string, feideEmail: string, email: string, username: string, firstName: string, lastName: string, dateJoined: string, graduationYear?: number | null, gradeYear?: number | null, allergies?: string | null, phoneNumber: string, firstLogin: boolean, events?: Array<{ __typename?: 'EventType', id: string }> | null, organizations: Array<{ __typename?: 'OrganizationType', id: string, name: string }> } | null };

export type UserToEditQueryVariables = Exact<{ [key: string]: never; }>;


export type UserToEditQuery = { __typename?: 'Queries', user?: { __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string, phoneNumber: string, allergies?: string | null, email: string, graduationYear?: number | null, firstLogin: boolean, feideEmail: string, canUpdateYear?: boolean | null, yearUpdatedAt?: string | null, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null } | null };

export type UserOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserOrganizationsQuery = { __typename?: 'Queries', user?: { __typename?: 'UserType', id: string, isIndok: boolean, organizations: Array<{ __typename?: 'OrganizationType', id: string, name: string, slug: string, logoUrl?: string | null, color?: string | null, description: string }> } | null };

export type AdminEditCapabilitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminEditCapabilitiesQuery = { __typename?: 'Queries', canManageUserProfiles: boolean, canManageUserNfc: boolean };

export type NfcUserSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type NfcUserSearchQuery = { __typename?: 'Queries', nfcUserSearch?: Array<{ __typename?: 'UserType', id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null }> | null };

export type NfcUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type NfcUserQuery = { __typename?: 'Queries', nfcUser?: { __typename?: 'UserType', email: string, graduationYear?: number | null, nfcPermanentAccessStatus?: string | null, nfcPermanentAccessEnds?: string | null, nfcNote?: string | null, nfcNoteUpdatedAt?: string | null, nfcNoteUpdatedBy?: string | null, id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null, nfcPermanentAccessHistory?: Array<{ __typename?: 'NfcPermanentAccessChangeType', given: boolean, changedAt: string, changedBy?: string | null, reason: string }> | null, organizations: Array<{ __typename?: 'OrganizationType', id: string, name: string }> } | null };

export type NfcPermanentAccessUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type NfcPermanentAccessUsersQuery = { __typename?: 'Queries', nfcPermanentAccessUsers?: Array<{ __typename?: 'UserType', email: string, graduationYear?: number | null, nfcPermanentAccessStatus?: string | null, nfcPermanentAccessEnds?: string | null, nfcNote?: string | null, nfcNoteUpdatedAt?: string | null, nfcNoteUpdatedBy?: string | null, id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null, organizations: Array<{ __typename?: 'OrganizationType', id: string, name: string }> }> | null };

export type AdminUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AdminUserQuery = { __typename?: 'Queries', adminUser?: { __typename?: 'UserType', email: string, phoneNumber: string, allergies?: string | null, graduationYear?: number | null, gradeYear?: number | null, dateJoined: string, lastLogin?: string | null, feideUserid: string, id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null } | null };

export type UserSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UserSearchQuery = { __typename?: 'Queries', userSearch?: Array<{ __typename?: 'UserType', email: string, phoneNumber: string, allergies?: string | null, graduationYear?: number | null, gradeYear?: number | null, dateJoined: string, lastLogin?: string | null, feideUserid: string, id: string, username: string, firstName: string, lastName: string, feideEmail: string, nfcMifareCsn?: string | null, nfcCardNumber?: string | null, nfcHasPin?: boolean | null, nfcPermanentAccess?: boolean | null }> | null };

export type ServerTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerTimeQuery = { __typename?: 'Queries', serverTime?: string | null };

export const DocumentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Document"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveDocumentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"typeDoc"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"webLink"}}]}}]} as unknown as DocumentNode<DocumentFragment, unknown>;
export const CabinFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CabinType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxGuests"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"internalPriceWeekend"}},{"kind":"Field","name":{"kind":"Name","value":"externalPriceWeekend"}}]}}]} as unknown as DocumentNode<CabinFragment, unknown>;
export const BookingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Booking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AllBookingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<BookingFragment, unknown>;
export const AdminBookingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"receiverEmail"}},{"kind":"Field","name":{"kind":"Name","value":"externalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"internalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isTentative"}},{"kind":"Field","name":{"kind":"Name","value":"isDeclined"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"extraInfo"}},{"kind":"Field","name":{"kind":"Name","value":"declineReason"}}]}}]} as unknown as DocumentNode<AdminBookingFragment, unknown>;
export const BookingResponsibleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingResponsible"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingResponsibleType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]} as unknown as DocumentNode<BookingResponsibleFragment, unknown>;
export const BookingSemesterFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingSemesterType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}}]}}]} as unknown as DocumentNode<BookingSemesterFragment, unknown>;
export const ProductFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}}]} as unknown as DocumentNode<ProductFragment, unknown>;
export const OrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}}]} as unknown as DocumentNode<OrderFragment, unknown>;
export const EventFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<EventFieldsFragment, unknown>;
export const EventDetailFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]}}]} as unknown as DocumentNode<EventDetailFieldsFragment, unknown>;
export const SignUpWithTicketFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUpWithTicket"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}}]} as unknown as DocumentNode<SignUpWithTicketFragment, unknown>;
export const SignUpFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}}]}}]} as unknown as DocumentNode<SignUpFragment, unknown>;
export const AdminEventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}}]}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignUpWithTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usersOnWaitingList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignUp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUpWithTicket"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}}]}}]} as unknown as DocumentNode<AdminEventFragment, unknown>;
export const OptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<OptionFragment, unknown>;
export const QuestionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<QuestionFragment, unknown>;
export const AnswerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<AnswerFragment, unknown>;
export const QuestionWithAnswerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<QuestionWithAnswerFragment, unknown>;
export const FormWithAnswersFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAnswers"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}}]} as unknown as DocumentNode<FormWithAnswersFragment, unknown>;
export const JanHusBookingAvailabilityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingAvailability"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<JanHusBookingAvailabilityFragment, unknown>;
export const JanHusGuestListEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]} as unknown as DocumentNode<JanHusGuestListEntryFragment, unknown>;
export const JanHusBookingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"bookerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDoorAccess"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideTier"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideAmount"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyMarkedAsPaid"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]} as unknown as DocumentNode<JanHusBookingFragment, unknown>;
export const JanHusAdminBookingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusAdminBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessWarnings"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"bookerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDoorAccess"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideTier"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideAmount"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyMarkedAsPaid"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<JanHusAdminBookingFragment, unknown>;
export const JanHusBookingRequestFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<JanHusBookingRequestFragment, unknown>;
export const JanHusAdminBookingRequestFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusAdminBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingRequest"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<JanHusAdminBookingRequestFragment, unknown>;
export const JanHusBookingSettingsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingSettingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"minDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"slotGranularityMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"openingHour"}},{"kind":"Field","name":{"kind":"Name","value":"closingHour"}},{"kind":"Field","name":{"kind":"Name","value":"bufferMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"organizationBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"generalBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"externalBookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"privateBookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningOptionEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"guidelinesUrl"}},{"kind":"Field","name":{"kind":"Name","value":"guidelinesTitle"}}]}}]} as unknown as DocumentNode<JanHusBookingSettingsFragment, unknown>;
export const JanHusAreaFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusArea"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusAreaType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"internalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"externalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningFee"}},{"kind":"Field","name":{"kind":"Name","value":"defaultDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"conflictingAreaIds"}}]}}]} as unknown as DocumentNode<JanHusAreaFragment, unknown>;
export const ListingOrganizationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<ListingOrganizationFragment, unknown>;
export const ListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<ListingFragment, unknown>;
export const ListingWithFormIdFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithFormId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}}]} as unknown as DocumentNode<ListingWithFormIdFragment, unknown>;
export const FormFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Form"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}}]} as unknown as DocumentNode<FormFragment, unknown>;
export const ListingWithFormFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithForm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Form"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Form"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}}]}}]} as unknown as DocumentNode<ListingWithFormFragment, unknown>;
export const QuestionWithAnswerIdsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}}]} as unknown as DocumentNode<QuestionWithAnswerIdsFragment, unknown>;
export const AnswerWithQuestionIdFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]} as unknown as DocumentNode<AnswerWithQuestionIdFragment, unknown>;
export const ResponseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ResponseFragment, unknown>;
export const FormWithAllResponsesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}}]} as unknown as DocumentNode<FormWithAllResponsesFragment, unknown>;
export const ListingWithResponsesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}}]} as unknown as DocumentNode<ListingWithResponsesFragment, unknown>;
export const OrgAdminEventFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<OrgAdminEventFragment, unknown>;
export const OrgAdminListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}}]}}]} as unknown as DocumentNode<OrgAdminListingFragment, unknown>;
export const AdminOrganizationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hrGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgAdminEvent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgAdminListing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}}]}}]} as unknown as DocumentNode<AdminOrganizationFragment, unknown>;
export const MembershipFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<MembershipFragment, unknown>;
export const MembershipWithOrganizationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MembershipWithOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Membership"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<MembershipWithOrganizationFragment, unknown>;
export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const UserWithEventsAndOrgsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithEventsAndOrgs"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<UserWithEventsAndOrgsFragment, unknown>;
export const UserToEditFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserToEditFragment, unknown>;
export const UserAdminEditFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserToEdit"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserAdminEditFragment, unknown>;
export const UserNfcSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserNfcSearchFragment, unknown>;
export const UserNfcDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccessStatus"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccessEnds"}},{"kind":"Field","name":{"kind":"Name","value":"nfcNote"}},{"kind":"Field","name":{"kind":"Name","value":"nfcNoteUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcNoteUpdatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserNfcDetailFragment, unknown>;
export const UserAdminSearchFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserAdminSearchFragment, unknown>;
export const UserOrganizationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<UserOrganizationFragment, unknown>;
export const ArchiveByTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"archiveByTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"names"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveByTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"typeDoc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"names"},"value":{"kind":"Variable","name":{"kind":"Name","value":"names"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Document"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Document"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveDocumentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"typeDoc"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"webLink"}}]}}]} as unknown as DocumentNode<ArchiveByTypesQuery, ArchiveByTypesQueryVariables>;
export const FeaturedArchiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"featuredArchive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"featuredArchive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Document"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Document"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveDocumentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"typeDoc"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"webLink"}}]}}]} as unknown as DocumentNode<FeaturedArchiveQuery, FeaturedArchiveQueryVariables>;
export const AvailableYearsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"availableYears"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableYears"}}]}}]} as unknown as DocumentNode<AvailableYearsQuery, AvailableYearsQueryVariables>;
export const DocumentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"documents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"names"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveByTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"typeDoc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"names"},"value":{"kind":"Variable","name":{"kind":"Name","value":"names"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Document"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredArchive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Document"}}]}},{"kind":"Field","name":{"kind":"Name","value":"availableYears"}},{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"archive.view_archivedocument","block":false}}]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Document"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveDocumentType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"typeDoc"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"webLink"}}]}}]} as unknown as DocumentNode<DocumentsQuery, DocumentsQueryVariables>;
export const CreateBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<CreateBookingMutation, CreateBookingMutationVariables>;
export const ConfirmBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"confirmBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isTentative"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<ConfirmBookingMutation, ConfirmBookingMutationVariables>;
export const DeclineBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"declineBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"declineReason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isTentative"},"value":{"kind":"BooleanValue","value":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"isDeclined"},"value":{"kind":"BooleanValue","value":true}},{"kind":"ObjectField","name":{"kind":"Name","value":"declineReason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"declineReason"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeclineBookingMutation, DeclineBookingMutationVariables>;
export const SendEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SendEmailMutation, SendEmailMutationVariables>;
export const UpdateCabinDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCabin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cabinData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCabinInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCabin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cabinData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cabinData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabin"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CabinType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxGuests"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"internalPriceWeekend"}},{"kind":"Field","name":{"kind":"Name","value":"externalPriceWeekend"}}]}}]} as unknown as DocumentNode<UpdateCabinMutation, UpdateCabinMutationVariables>;
export const UpdateBookingSemesterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateBookingSemester"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"semesterData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingSemesterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBookingSemester"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"semesterData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"semesterData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingSemester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingSemester"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingSemesterType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}}]}}]} as unknown as DocumentNode<UpdateBookingSemesterMutation, UpdateBookingSemesterMutationVariables>;
export const CabinsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabin"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CabinType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxGuests"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"internalPriceWeekend"}},{"kind":"Field","name":{"kind":"Name","value":"externalPriceWeekend"}}]}}]} as unknown as DocumentNode<CabinsQuery, CabinsQueryVariables>;
export const AllBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Booking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Booking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AllBookingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AllBookingsQuery, AllBookingsQueryVariables>;
export const MyCabinBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myCabinBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCabinBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminBooking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"receiverEmail"}},{"kind":"Field","name":{"kind":"Name","value":"externalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"internalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isTentative"}},{"kind":"Field","name":{"kind":"Name","value":"isDeclined"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"extraInfo"}},{"kind":"Field","name":{"kind":"Name","value":"declineReason"}}]}}]} as unknown as DocumentNode<MyCabinBookingsQuery, MyCabinBookingsQueryVariables>;
export const AdminAllBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminAllBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminAllBookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminBooking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AdminBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkIn"}},{"kind":"Field","name":{"kind":"Name","value":"checkOut"}},{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"receiverEmail"}},{"kind":"Field","name":{"kind":"Name","value":"externalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"internalParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isTentative"}},{"kind":"Field","name":{"kind":"Name","value":"isDeclined"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"extraInfo"}},{"kind":"Field","name":{"kind":"Name","value":"declineReason"}}]}}]} as unknown as DocumentNode<AdminAllBookingsQuery, AdminAllBookingsQueryVariables>;
export const ActiveBookingResponsibleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"activeBookingResponsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeBookingResponsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingResponsible"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingResponsible"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingResponsibleType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]} as unknown as DocumentNode<ActiveBookingResponsibleQuery, ActiveBookingResponsibleQueryVariables>;
export const CabinsAndResponsiblesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cabinsAndResponsibles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cabins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Cabin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activeBookingResponsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Cabin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CabinType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxGuests"}},{"kind":"Field","name":{"kind":"Name","value":"internalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"externalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"internalPriceWeekend"}},{"kind":"Field","name":{"kind":"Name","value":"externalPriceWeekend"}}]}}]} as unknown as DocumentNode<CabinsAndResponsiblesQuery, CabinsAndResponsiblesQueryVariables>;
export const BookingSemesterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bookingSemester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingSemester"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingSemester"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingSemester"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBookingSemesterType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}}]}}]} as unknown as DocumentNode<BookingSemesterQuery, BookingSemesterQueryVariables>;
export const InitiateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"initiateOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fallbackRedirect"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initiateOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"quantity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}}},{"kind":"Argument","name":{"kind":"Name","value":"fallbackRedirect"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fallbackRedirect"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redirect"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}}]}}]}}]} as unknown as DocumentNode<InitiateOrderMutation, InitiateOrderMutationVariables>;
export const AttemptCapturePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attemptCapturePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attemptCapturePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<AttemptCapturePaymentMutation, AttemptCapturePaymentMutationVariables>;
export const DeliveredProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deliveredProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<DeliveredProductMutation, DeliveredProductMutationVariables>;
export const ProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"product"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}}]} as unknown as DocumentNode<ProductQuery, ProductQueryVariables>;
export const ProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}}]}}]} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const UserOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<UserOrdersQuery, UserOrdersQueryVariables>;
export const AllUserOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allUserOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUserOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<AllUserOrdersQuery, AllUserOrdersQueryVariables>;
export const PaginatedShopOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"paginatedShopOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginatedShopOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Product"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"maxBuyableQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"shopItem"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"deliveredProduct"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<PaginatedShopOrdersQuery, PaginatedShopOrdersQueryVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const UpdateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"eventData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventDetailFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]}}]} as unknown as DocumentNode<UpdateEventMutation, UpdateEventMutationVariables>;
export const EventSignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"eventSignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"extraInformation"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventSignUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"extraInformation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"extraInformation"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventSignUpMutation, EventSignUpMutationVariables>;
export const EventSignOffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"eventSignOff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventSignOff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EventSignOffMutation, EventSignOffMutationVariables>;
export const AdminEventSignOffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminEventSignOff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminEventSignOff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AdminEventSignOffMutation, AdminEventSignOffMutationVariables>;
export const SendEventMailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendEventMails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"receiverEmails"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subject"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendEventMails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"receiverEmails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"receiverEmails"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"subject"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subject"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SendEventMailsMutation, SendEventMailsMutationVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"events"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organization"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organization"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"startTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"endTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"events.add_event","block":false}}]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const EventDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventDetailFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"positionOnWaitingList"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]}}]} as unknown as DocumentNode<EventDetailsQuery, EventDetailsQueryVariables>;
export const AllCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AllCategoriesQuery, AllCategoriesQueryVariables>;
export const EventFilteredOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventFilteredOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventFilteredOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<EventFilteredOrganizationsQuery, EventFilteredOrganizationsQueryVariables>;
export const AdminEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminEvent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUpWithTicket"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"hasBoughtTicket"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignUp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"userGradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"userAllergies"}},{"kind":"Field","name":{"kind":"Name","value":"userPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"extraInformation"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"publisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}}]}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"signupOpenDate"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignUpWithTicket"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usersOnWaitingList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignUp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userAttendance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isSignedUp"}},{"kind":"Field","name":{"kind":"Name","value":"isOnWaitingList"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"hasExtraInformation"}},{"kind":"Field","name":{"kind":"Name","value":"bindingSignup"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"allowedGradeYears"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AdminEventQuery, AdminEventQueryVariables>;
export const EventSignUpsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventSignUps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAttendable"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userEmail"}}]}}]}}]}}]} as unknown as DocumentNode<EventSignUpsQuery, EventSignUpsQueryVariables>;
export const AttendeeReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendeeReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendeeReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}},{"kind":"Argument","name":{"kind":"Name","value":"filetype"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}}}]}]}}]} as unknown as DocumentNode<AttendeeReportQuery, AttendeeReportQueryVariables>;
export const AttendeeReportOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendeeReportOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendeeReportOrg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}},{"kind":"Argument","name":{"kind":"Name","value":"filetype"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}}}]}]}}]} as unknown as DocumentNode<AttendeeReportOrgQuery, AttendeeReportOrgQueryVariables>;
export const AttendeeReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"attendeeReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attendeeReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}},{"kind":"Argument","name":{"kind":"Name","value":"filetype"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filetype"}}}]}]}}]} as unknown as DocumentNode<AttendeeReportsQuery, AttendeeReportsQueryVariables>;
export const EventUserOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventUserOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<EventUserOrganizationsQuery, EventUserOrganizationsQueryVariables>;
export const CreateFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFormInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listingId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formData"}}},{"kind":"Argument","name":{"kind":"Name","value":"listingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}}]} as unknown as DocumentNode<CreateFormMutation, CreateFormMutationVariables>;
export const UpdateFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BaseFormInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateForm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"formData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}}]} as unknown as DocumentNode<UpdateFormMutation, UpdateFormMutationVariables>;
export const CreateQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateQuestionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}},{"kind":"Argument","name":{"kind":"Name","value":"questionData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateQuestionMutation, CreateQuestionMutationVariables>;
export const UpdateQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BaseQuestionInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"optionData"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OptionInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUpdateAndDeleteOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"optionData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"optionData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updateQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"questionData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateQuestionMutation, UpdateQuestionMutationVariables>;
export const DeleteQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedId"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteQuestionMutation, DeleteQuestionMutationVariables>;
export const SubmitAnswersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"submitAnswers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"answersData"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAnswers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}},{"kind":"Argument","name":{"kind":"Name","value":"answersData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"answersData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SubmitAnswersMutation, SubmitAnswersMutationVariables>;
export const FormWithAllResponsesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"formWithAllResponses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}}]} as unknown as DocumentNode<FormWithAllResponsesQuery, FormWithAllResponsesQueryVariables>;
export const FormWithAnswersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"formWithAnswers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"form"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAnswers"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAnswers"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswer"}}]}}]}}]} as unknown as DocumentNode<FormWithAnswersQuery, FormWithAnswersQueryVariables>;
export const CreateJanhusBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateJanhusBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createJanhusBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"bookerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDoorAccess"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideTier"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideAmount"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyMarkedAsPaid"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateJanhusBookingMutation, CreateJanhusBookingMutationVariables>;
export const UpdateJanhusBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateJanhusBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateJanHusBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateJanhusBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overlappingBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"bookerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDoorAccess"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideTier"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideAmount"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyMarkedAsPaid"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateJanhusBookingMutation, UpdateJanhusBookingMutationVariables>;
export const ReviewJanhusBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReviewJanhusBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reviewData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewJanHusBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewJanhusBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reviewData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reviewData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"bookerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDoorAccess"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideTier"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideAmount"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyMarkedAsPaid"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ReviewJanhusBookingMutation, ReviewJanhusBookingMutationVariables>;
export const CreateJanhusBookingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateJanhusBookingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createJanhusBookingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"bookingRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingRequest"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateJanhusBookingRequestMutation, CreateJanhusBookingRequestMutationVariables>;
export const ReviewJanhusBookingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReviewJanhusBookingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reviewData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewJanHusBookingRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewJanhusBookingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reviewData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reviewData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"bookingRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingRequest"}}]}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overlappingBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"bookerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDoorAccess"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideTier"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideAmount"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyMarkedAsPaid"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ReviewJanhusBookingRequestMutation, ReviewJanhusBookingRequestMutationVariables>;
export const UpdateJanhusBookingSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateJanhusBookingSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"settingsData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateJanhusBookingSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"settingsData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"settingsData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"bookingSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingSettings"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingSettingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"minDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"slotGranularityMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"openingHour"}},{"kind":"Field","name":{"kind":"Name","value":"closingHour"}},{"kind":"Field","name":{"kind":"Name","value":"bufferMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"organizationBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"generalBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"externalBookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"privateBookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningOptionEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"guidelinesUrl"}},{"kind":"Field","name":{"kind":"Name","value":"guidelinesTitle"}}]}}]} as unknown as DocumentNode<UpdateJanhusBookingSettingsMutation, UpdateJanhusBookingSettingsMutationVariables>;
export const UpdateJanhusAreaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateJanhusArea"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"areaData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateJanHusAreaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateJanhusArea"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"areaData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"areaData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusArea"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusArea"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusAreaType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"internalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"externalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningFee"}},{"kind":"Field","name":{"kind":"Name","value":"defaultDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"conflictingAreaIds"}}]}}]} as unknown as DocumentNode<UpdateJanhusAreaMutation, UpdateJanhusAreaMutationVariables>;
export const CreateJanhusPaymentProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateJanhusPaymentProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createJanhusPaymentProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"bookerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDoorAccess"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideTier"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideAmount"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyMarkedAsPaid"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateJanhusPaymentProductMutation, CreateJanhusPaymentProductMutationVariables>;
export const DeleteJanhusBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteJanhusBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteJanhusBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}}},{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteJanhusBookingMutation, DeleteJanhusBookingMutationVariables>;
export const DeleteJanhusBookingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteJanhusBookingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteJanhusBookingRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteJanhusBookingRequestMutation, DeleteJanhusBookingRequestMutationVariables>;
export const JanHusBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startsAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endsAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"area"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startsAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startsAt"}}},{"kind":"Argument","name":{"kind":"Name","value":"endsAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endsAt"}}},{"kind":"Argument","name":{"kind":"Name","value":"area"},"value":{"kind":"Variable","name":{"kind":"Name","value":"area"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingAvailability"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingAvailability"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<JanHusBookingsQuery, JanHusBookingsQueryVariables>;
export const JanHusBookingCalendarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookingCalendar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startsAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startsAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startsAt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingAvailability"}},{"kind":"Field","name":{"kind":"Name","value":"ownerDisplayName"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingAvailability"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<JanHusBookingCalendarQuery, JanHusBookingCalendarQueryVariables>;
export const JanHusMyBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusMyBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusMyBookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"bookerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDoorAccess"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideTier"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideAmount"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyMarkedAsPaid"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<JanHusMyBookingsQuery, JanHusMyBookingsQueryVariables>;
export const JanHusMyBookingRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusMyBookingRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusMyBookingRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingRequest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<JanHusMyBookingRequestsQuery, JanHusMyBookingRequestsQueryVariables>;
export const JanHusGuestSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusGuestSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusGuestSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]} as unknown as DocumentNode<JanHusGuestSearchQuery, JanHusGuestSearchQueryVariables>;
export const JanHusGuestSearchForRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusGuestSearchForRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusGuestSearchForRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]} as unknown as DocumentNode<JanHusGuestSearchForRequestQuery, JanHusGuestSearchForRequestQueryVariables>;
export const AdminJanHusBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminJanHusBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminJanhusBookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusAdminBooking"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusGuestListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusGuestListEntryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ownerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isExternalBooking"}},{"kind":"Field","name":{"kind":"Name","value":"bookerName"}},{"kind":"Field","name":{"kind":"Name","value":"bookerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"bookerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"bookerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"depositStatus"}},{"kind":"Field","name":{"kind":"Name","value":"depositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAt"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"guestListEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusGuestListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"organizationDoorAccess"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideTier"}},{"kind":"Field","name":{"kind":"Name","value":"priceOverrideAmount"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyMarkedAsPaid"}},{"kind":"Field","name":{"kind":"Name","value":"vippsProduct"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vippsOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusAdminBooking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBooking"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}},{"kind":"Field","name":{"kind":"Name","value":"doorAccessWarnings"}}]}}]} as unknown as DocumentNode<AdminJanHusBookingsQuery, AdminJanHusBookingsQueryVariables>;
export const JanHusBookerDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookerDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]} as unknown as DocumentNode<JanHusBookerDetailsQuery, JanHusBookerDetailsQueryVariables>;
export const JanHusUserSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusUserSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusUserSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<JanHusUserSearchQuery, JanHusUserSearchQueryVariables>;
export const JanHusBookableOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookableOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookableOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<JanHusBookableOrganizationsQuery, JanHusBookableOrganizationsQueryVariables>;
export const JanHusContractPreviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusContractPreview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contractData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusContractPreviewInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusContractPreview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"contractData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contractData"}}}]}]}}]} as unknown as DocumentNode<JanHusContractPreviewQuery, JanHusContractPreviewQueryVariables>;
export const JanHusContractSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusContractSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookingSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"keyBoxCode"}},{"kind":"Field","name":{"kind":"Name","value":"bookingContactName"}},{"kind":"Field","name":{"kind":"Name","value":"bookingContactPhone"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"contractRentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"contractMaxFee"}},{"kind":"Field","name":{"kind":"Name","value":"contractCleaningDeadlineHours"}}]}}]}}]} as unknown as DocumentNode<JanHusContractSettingsQuery, JanHusContractSettingsQueryVariables>;
export const JanHusBookingSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookingSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookingSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingSettings"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingSettingsType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"minDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"slotGranularityMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"openingHour"}},{"kind":"Field","name":{"kind":"Name","value":"closingHour"}},{"kind":"Field","name":{"kind":"Name","value":"bufferMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"organizationBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"generalBookingOpensWeeksBefore"}},{"kind":"Field","name":{"kind":"Name","value":"fallStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"springStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"springEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"fallSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"springSemesterActive"}},{"kind":"Field","name":{"kind":"Name","value":"externalBookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"privateBookingsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningOptionEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"guidelinesUrl"}},{"kind":"Field","name":{"kind":"Name","value":"guidelinesTitle"}}]}}]} as unknown as DocumentNode<JanHusBookingSettingsQuery, JanHusBookingSettingsQueryVariables>;
export const JanHusAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusAreas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusAreas"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusArea"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusArea"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusAreaType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"internalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"externalPricePerHour"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningFee"}},{"kind":"Field","name":{"kind":"Name","value":"defaultDepositAmount"}},{"kind":"Field","name":{"kind":"Name","value":"conflictingAreaIds"}}]}}]} as unknown as DocumentNode<JanHusAreasQuery, JanHusAreasQueryVariables>;
export const JanHusBookingRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusBookingRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"janhusBookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusAdminBookingRequest"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerOrganization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requesterName"}},{"kind":"Field","name":{"kind":"Name","value":"requesterEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requesterPhone"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"responsibleEmail"}},{"kind":"Field","name":{"kind":"Name","value":"responsiblePhone"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"cleaningRequested"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"guestList"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bookerMessage"}},{"kind":"Field","name":{"kind":"Name","value":"convertedBooking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JanHusAdminBookingRequest"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JanHusBookingRequestType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JanHusBookingRequest"}},{"kind":"Field","name":{"kind":"Name","value":"adminComment"}}]}}]} as unknown as DocumentNode<JanHusBookingRequestsQuery, JanHusBookingRequestsQueryVariables>;
export const JanHusAdminAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JanHusAdminAccess"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"canManage"},"name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"janhus.manage_booking","block":false}}]},{"kind":"Field","alias":{"kind":"Name","value":"canView"},"name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"janhus.view_all_bookings","block":false}}]},{"kind":"Field","alias":{"kind":"Name","value":"canViewDoorLog"},"name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"StringValue","value":"nfc.view_door_log","block":false}}]}]}}]} as unknown as DocumentNode<JanHusAdminAccessQuery, JanHusAdminAccessQueryVariables>;
export const CreateListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createListing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateListingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<CreateListingMutation, CreateListingMutationVariables>;
export const UpdateListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateListing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BaseListingInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"listingData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<UpdateListingMutation, UpdateListingMutationVariables>;
export const DeleteListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteListing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteListing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listingId"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteListingMutation, DeleteListingMutationVariables>;
export const ListingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingWithFormId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithFormId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ListingQuery, ListingQueryVariables>;
export const ListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}}]} as unknown as DocumentNode<ListingsQuery, ListingsQueryVariables>;
export const ListingWithFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listingWithForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingWithForm"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Form"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithForm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Form"}}]}}]}}]} as unknown as DocumentNode<ListingWithFormQuery, ListingWithFormQueryVariables>;
export const ListingWithResponsesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listingWithResponses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingWithResponses"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Listing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"endDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"applicationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"chips"}},{"kind":"Field","name":{"kind":"Name","value":"readMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"heroImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ListingOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Option"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"questionType"}},{"kind":"Field","name":{"kind":"Name","value":"mandatory"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Option"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuestionWithAnswerIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Answer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AnswerWithQuestionId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnswerType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Answer"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Response"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"respondent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AnswerWithQuestionId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FormWithAllResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuestionWithAnswerIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Response"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ListingWithResponses"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Listing"}},{"kind":"Field","name":{"kind":"Name","value":"form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FormWithAllResponses"}}]}}]}}]} as unknown as DocumentNode<ListingWithResponsesQuery, ListingWithResponsesQueryVariables>;
export const DoorLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DoorLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"result"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"since"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"until"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"doorLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"result"},"value":{"kind":"Variable","name":{"kind":"Name","value":"result"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"since"},"value":{"kind":"Variable","name":{"kind":"Name","value":"since"}}},{"kind":"Argument","name":{"kind":"Name","value":"until"},"value":{"kind":"Variable","name":{"kind":"Name","value":"until"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"doorIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isWebsiteUser"}},{"kind":"Field","name":{"kind":"Name","value":"holderKind"}},{"kind":"Field","name":{"kind":"Name","value":"mifareCsnReported"}},{"kind":"Field","name":{"kind":"Name","value":"cardFormat"}},{"kind":"Field","name":{"kind":"Name","value":"arxEvent"}}]}}]}}]}}]} as unknown as DocumentNode<DoorLogQuery, DoorLogQueryVariables>;
export const UpsertMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"membershipData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"membershipData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"membershipData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MembershipWithOrganization"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MembershipWithOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Membership"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpsertMembershipMutation, UpsertMembershipMutationVariables>;
export const AddMembershipByIdentifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addMembershipByIdentifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMembershipByIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<AddMembershipByIdentifierMutation, AddMembershipByIdentifierMutationVariables>;
export const RemoveMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"membershipId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"membershipId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"removedMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveMembershipMutation, RemoveMembershipMutationVariables>;
export const AdminOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminOrganization"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminEvent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"availableSlots"}},{"kind":"Field","name":{"kind":"Name","value":"isFull"}},{"kind":"Field","name":{"kind":"Name","value":"usersAttending"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrgAdminListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ListingType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hrGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgAdminEvent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrgAdminListing"}}]}}]}}]} as unknown as DocumentNode<AdminOrganizationQuery, AdminOrganizationQueryVariables>;
export const MembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"memberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Membership"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Membership"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<MembershipsQuery, MembershipsQueryVariables>;
export const AllOrganizationsForAdminEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allOrganizationsForAdminEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allOrganizations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"primaryGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hrGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groupType"}}]}}]}}]}}]} as unknown as DocumentNode<AllOrganizationsForAdminEditQuery, AllOrganizationsForAdminEditQueryVariables>;
export const HasPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"hasPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permission"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permission"}}}]}]}}]} as unknown as DocumentNode<HasPermissionQuery, HasPermissionQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idToken"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const AuthUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"authUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<AuthUserMutation, AuthUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userData"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const AdminUpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAdminEdit"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserToEdit"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}}]} as unknown as DocumentNode<AdminUpdateUserMutation, AdminUpdateUserMutationVariables>;
export const AdminUpdateUserNfcDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateUserNfc"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nfcData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminUserNfcInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateUserNfc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"nfcData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nfcData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAdminEdit"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserToEdit"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}}]} as unknown as DocumentNode<AdminUpdateUserNfcMutation, AdminUpdateUserNfcMutationVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UserWithEventsAndOrgsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userWithEventsAndOrgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserWithEventsAndOrgs"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserWithEventsAndOrgs"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserWithEventsAndOrgsQuery, UserWithEventsAndOrgsQueryVariables>;
export const UserToEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userToEdit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserToEdit"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserToEdit"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"firstLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"canUpdateYear"}},{"kind":"Field","name":{"kind":"Name","value":"yearUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<UserToEditQuery, UserToEditQueryVariables>;
export const UserOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isIndok"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserOrganization"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserOrganization"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<UserOrganizationsQuery, UserOrganizationsQueryVariables>;
export const AdminEditCapabilitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminEditCapabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canManageUserProfiles"}},{"kind":"Field","name":{"kind":"Name","value":"canManageUserNfc"}}]}}]} as unknown as DocumentNode<AdminEditCapabilitiesQuery, AdminEditCapabilitiesQueryVariables>;
export const NfcUserSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nfcUserSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfcUserSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}}]} as unknown as DocumentNode<NfcUserSearchQuery, NfcUserSearchQueryVariables>;
export const NfcUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nfcUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfcUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcDetail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccessHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"given"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"changedBy"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccessStatus"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccessEnds"}},{"kind":"Field","name":{"kind":"Name","value":"nfcNote"}},{"kind":"Field","name":{"kind":"Name","value":"nfcNoteUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcNoteUpdatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<NfcUserQuery, NfcUserQueryVariables>;
export const NfcPermanentAccessUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"nfcPermanentAccessUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccessUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcDetail"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccessStatus"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccessEnds"}},{"kind":"Field","name":{"kind":"Name","value":"nfcNote"}},{"kind":"Field","name":{"kind":"Name","value":"nfcNoteUpdatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nfcNoteUpdatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<NfcPermanentAccessUsersQuery, NfcPermanentAccessUsersQueryVariables>;
export const AdminUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAdminSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}}]}}]} as unknown as DocumentNode<AdminUserQuery, AdminUserQueryVariables>;
export const UserSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserAdminSearch"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserNfcSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"feideEmail"}},{"kind":"Field","name":{"kind":"Name","value":"nfcMifareCsn"}},{"kind":"Field","name":{"kind":"Name","value":"nfcCardNumber"}},{"kind":"Field","name":{"kind":"Name","value":"nfcHasPin"}},{"kind":"Field","name":{"kind":"Name","value":"nfcPermanentAccess"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserAdminSearch"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserNfcSearch"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"graduationYear"}},{"kind":"Field","name":{"kind":"Name","value":"gradeYear"}},{"kind":"Field","name":{"kind":"Name","value":"dateJoined"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"feideUserid"}}]}}]} as unknown as DocumentNode<UserSearchQuery, UserSearchQueryVariables>;
export const ServerTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"serverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverTime"}}]}}]} as unknown as DocumentNode<ServerTimeQuery, ServerTimeQueryVariables>;