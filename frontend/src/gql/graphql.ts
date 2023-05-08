/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: string;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: string;
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: number;
  /**
   * Leverages the internal Python implmeentation of UUID (uuid.UUID) to provide native UUID objects
   * in fields, resolvers and input.
   */
  UUID: string;
};

/** Booking type for admin users */
export type AdminBookingType = {
  __typename: "AdminBookingType";
  cabins: Array<CabinType>;
  checkIn: Scalars["Date"];
  checkOut: Scalars["Date"];
  declineReason: Scalars["String"];
  externalParticipants: Scalars["Int"];
  extraInfo: Scalars["String"];
  firstName: Scalars["String"];
  id: Scalars["ID"];
  internalParticipants: Scalars["Int"];
  isDeclined: Scalars["Boolean"];
  isInternalPrice?: Maybe<Scalars["Int"]>;
  isTentative: Scalars["Boolean"];
  lastName: Scalars["String"];
  numberOfNights?: Maybe<Scalars["Int"]>;
  phone: Scalars["String"];
  price?: Maybe<Scalars["Int"]>;
  receiverEmail: Scalars["String"];
  timestamp: Scalars["DateTime"];
};

/**
 * Sets the field is_attending to False in the Sign Up for the user with the
 * given ID, for the event with the given ID
 * NOTE: The sign up still exists, it is not deleted from the database
 *       when a user signs off an event
 */
export type AdminEventSignOff = {
  __typename: "AdminEventSignOff";
  event?: Maybe<EventType>;
};

/** Booking type for fields available for not logged in users */
export type AllBookingsType = {
  __typename: "AllBookingsType";
  cabins: Array<CabinType>;
  checkIn: Scalars["Date"];
  checkOut: Scalars["Date"];
  id: Scalars["ID"];
};

export type AnswerInput = {
  answer: Scalars["String"];
  questionId: Scalars["ID"];
};

/** A user's answer to a question. */
export type AnswerType = {
  __typename: "AnswerType";
  answer: Scalars["String"];
  id?: Maybe<Scalars["UUID"]>;
  question: QuestionType;
  uuid: Scalars["UUID"];
};

export type ArchiveDocumentType = {
  __typename: "ArchiveDocumentType";
  featured: Scalars["Boolean"];
  fileLocation: Scalars["String"];
  id: Scalars["ID"];
  thumbnail?: Maybe<Scalars["String"]>;
  title: Scalars["String"];
  typeDoc: ArchiveDocumentTypeDoc;
  webLink?: Maybe<Scalars["String"]>;
  year?: Maybe<Scalars["Int"]>;
};

/** An enumeration. */
export enum ArchiveDocumentTypeDoc {
  /** Annet */
  Annet = "ANNET",
  /** Årbøker */
  Arboker = "ARBOKER",
  /** Budsjett og Regnskap */
  BudsjettOgRegnskap = "BUDSJETT_OG_REGNSKAP",
  /** Foreningens lover */
  ForeningensLover = "FORENINGENS_LOVER",
  /** Generalforsamling */
  Generalforsamling = "GENERALFORSAMLING",
  /** Januscript */
  Januscript = "JANUSCRIPT",
  /** Støtte fra HS */
  StotteFraHs = "STOTTE_FRA_HS",
  /** Utveksling */
  Utveksling = "UTVEKSLING",
}

export type AssignMembership = {
  __typename: "AssignMembership";
  membership?: Maybe<MembershipType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type AttemptCapturePayment = {
  __typename: "AttemptCapturePayment";
  order?: Maybe<OrderType>;
  status?: Maybe<PaymentStatus>;
};

export type AuthUser = {
  __typename: "AuthUser";
  user: UserType;
};

export type BaseFormInput = {
  description?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  organizationId?: InputMaybe<Scalars["ID"]>;
};

export type BaseListingInput = {
  application?: InputMaybe<Scalars["Boolean"]>;
  applicationUrl?: InputMaybe<Scalars["String"]>;
  case?: InputMaybe<Scalars["Boolean"]>;
  deadline?: InputMaybe<Scalars["DateTime"]>;
  description?: InputMaybe<Scalars["String"]>;
  endDatetime?: InputMaybe<Scalars["DateTime"]>;
  formId?: InputMaybe<Scalars["ID"]>;
  interview?: InputMaybe<Scalars["Boolean"]>;
  readMoreUrl?: InputMaybe<Scalars["String"]>;
  startDatetime?: InputMaybe<Scalars["DateTime"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type BaseQuestionInput = {
  description?: InputMaybe<Scalars["String"]>;
  mandatory?: InputMaybe<Scalars["Boolean"]>;
  question?: InputMaybe<Scalars["String"]>;
  questionType?: InputMaybe<QuestionTypeEnum>;
};

export type BlogPostType = {
  __typename: "BlogPostType";
  author?: Maybe<UserType>;
  blog?: Maybe<BlogType>;
  id: Scalars["ID"];
  publishDate: Scalars["DateTime"];
  text: Scalars["String"];
  title: Scalars["String"];
};

export type BlogType = {
  __typename: "BlogType";
  blogPosts: Array<BlogPostType>;
  description: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
  organization?: Maybe<OrganizationType>;
};

/** Basic booking object type used as a base for other types and as a standalone */
export type BookingInput = {
  cabins?: InputMaybe<Array<Scalars["Int"]>>;
  checkIn?: InputMaybe<Scalars["Date"]>;
  checkOut?: InputMaybe<Scalars["Date"]>;
  externalParticipants?: InputMaybe<Scalars["Int"]>;
  extraInfo?: InputMaybe<Scalars["String"]>;
  firstName?: InputMaybe<Scalars["String"]>;
  internalParticipants?: InputMaybe<Scalars["Int"]>;
  lastName?: InputMaybe<Scalars["String"]>;
  phone?: InputMaybe<Scalars["String"]>;
  receiverEmail?: InputMaybe<Scalars["String"]>;
};

export type BookingResponsibleType = {
  __typename: "BookingResponsibleType";
  active?: Maybe<Scalars["Boolean"]>;
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lastName?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["Int"]>;
};

export type CabinType = {
  __typename: "CabinType";
  externalPrice: Scalars["Int"];
  id: Scalars["ID"];
  internalPrice: Scalars["Int"];
  maxGuests: Scalars["Int"];
  name: Scalars["String"];
};

export type CategoryInput = {
  name?: InputMaybe<Scalars["String"]>;
};

export type CategoryType = {
  __typename: "CategoryType";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type CreateArchiveDocument = {
  __typename: "CreateArchiveDocument";
  arhiveDocument?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateBlog = {
  __typename: "CreateBlog";
  blog?: Maybe<BlogType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateBlogPost = {
  __typename: "CreateBlogPost";
  blogPost?: Maybe<BlogPostType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Add a new booking to the database */
export type CreateBooking = {
  __typename: "CreateBooking";
  booking?: Maybe<AllBookingsType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Create a new event category */
export type CreateCategory = {
  __typename: "CreateCategory";
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Create a new event */
export type CreateEvent = {
  __typename: "CreateEvent";
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateEventInput = {
  allowedGradeYears?: InputMaybe<Array<Scalars["Int"]>>;
  availableSlots?: InputMaybe<Scalars["Int"]>;
  bindingSignup?: InputMaybe<Scalars["Boolean"]>;
  categoryId?: InputMaybe<Scalars["ID"]>;
  contactEmail?: InputMaybe<Scalars["String"]>;
  deadline?: InputMaybe<Scalars["DateTime"]>;
  description: Scalars["String"];
  endTime?: InputMaybe<Scalars["DateTime"]>;
  hasExtraInformation?: InputMaybe<Scalars["Boolean"]>;
  image?: InputMaybe<Scalars["String"]>;
  isAttendable: Scalars["Boolean"];
  location?: InputMaybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  price?: InputMaybe<Scalars["Float"]>;
  shortDescription?: InputMaybe<Scalars["String"]>;
  signupOpenDate?: InputMaybe<Scalars["DateTime"]>;
  startTime: Scalars["DateTime"];
  title: Scalars["String"];
};

export type CreateForm = {
  __typename: "CreateForm";
  form?: Maybe<FormType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateFormInput = {
  description?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  organizationId: Scalars["ID"];
};

/** Creates a new listing */
export type CreateListing = {
  __typename: "CreateListing";
  listing?: Maybe<ListingType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateListingInput = {
  application?: InputMaybe<Scalars["Boolean"]>;
  applicationUrl?: InputMaybe<Scalars["String"]>;
  case?: InputMaybe<Scalars["Boolean"]>;
  deadline: Scalars["DateTime"];
  description?: InputMaybe<Scalars["String"]>;
  endDatetime?: InputMaybe<Scalars["DateTime"]>;
  formId?: InputMaybe<Scalars["ID"]>;
  interview?: InputMaybe<Scalars["Boolean"]>;
  organizationId: Scalars["ID"];
  readMoreUrl?: InputMaybe<Scalars["String"]>;
  startDatetime?: InputMaybe<Scalars["DateTime"]>;
  title: Scalars["String"];
};

export type CreateOrganization = {
  __typename: "CreateOrganization";
  ok?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<OrganizationType>;
};

export type CreateProduct = {
  __typename: "CreateProduct";
  ok?: Maybe<Scalars["Boolean"]>;
  product?: Maybe<ProductType>;
};

export type CreateProductInput = {
  description: Scalars["String"];
  maxBuyableQuantity: Scalars["Int"];
  name: Scalars["String"];
  organizationId: Scalars["ID"];
  price: Scalars["Decimal"];
  totalQuantity: Scalars["Int"];
};

export type CreateQuestion = {
  __typename: "CreateQuestion";
  ok?: Maybe<Scalars["Boolean"]>;
  question?: Maybe<QuestionType>;
};

export type CreateQuestionInput = {
  description?: InputMaybe<Scalars["String"]>;
  mandatory?: InputMaybe<Scalars["Boolean"]>;
  question: Scalars["String"];
  questionType?: InputMaybe<QuestionTypeEnum>;
};

export type CreateUpdateAndDeleteOptions = {
  __typename: "CreateUpdateAndDeleteOptions";
  ok?: Maybe<Scalars["Boolean"]>;
  options?: Maybe<Array<OptionType>>;
};

export type DeleteAnswer = {
  __typename: "DeleteAnswer";
  deletedUuid?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteAnswersToForm = {
  __typename: "DeleteAnswersToForm";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteArchiveDocument = {
  __typename: "DeleteArchiveDocument";
  archiveDocument?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteBlog = {
  __typename: "DeleteBlog";
  ok?: Maybe<Scalars["ID"]>;
};

export type DeleteBlogPost = {
  __typename: "DeleteBlogPost";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Deletes the booking with the given ID */
export type DeleteBooking = {
  __typename: "DeleteBooking";
  bookingId?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Deletes the category with a given ID */
export type DeleteCategory = {
  __typename: "DeleteCategory";
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Deletes the event with the given ID */
export type DeleteEvent = {
  __typename: "DeleteEvent";
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteForm = {
  __typename: "DeleteForm";
  deletedId?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Deletes the listing with the given ID */
export type DeleteListing = {
  __typename: "DeleteListing";
  listingId?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteOrganization = {
  __typename: "DeleteOrganization";
  ok?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<OrganizationType>;
};

export type DeleteQuestion = {
  __typename: "DeleteQuestion";
  deletedId?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type EmailInput = {
  cabins?: InputMaybe<Array<Scalars["Int"]>>;
  checkIn?: InputMaybe<Scalars["Date"]>;
  checkOut?: InputMaybe<Scalars["Date"]>;
  emailType?: InputMaybe<Scalars["String"]>;
  externalParticipants?: InputMaybe<Scalars["Int"]>;
  extraInfo?: InputMaybe<Scalars["String"]>;
  firstName?: InputMaybe<Scalars["String"]>;
  internalParticipants?: InputMaybe<Scalars["Int"]>;
  lastName?: InputMaybe<Scalars["String"]>;
  phone?: InputMaybe<Scalars["String"]>;
  receiverEmail?: InputMaybe<Scalars["String"]>;
};

/**
 * Sets the field is_attending to False in the Sign Up for the user that
 * sent the request, for the event with the given ID
 * NOTE: The sign up still exists, it is not deleted from the database
 *       when a user signs off an event
 */
export type EventSignOff = {
  __typename: "EventSignOff";
  event?: Maybe<EventType>;
  isFull?: Maybe<Scalars["Boolean"]>;
};

/**
 * Creates a new Sign Up for the user that sent the request, for the event
 * with the given ID
 */
export type EventSignUp = {
  __typename: "EventSignUp";
  event?: Maybe<EventType>;
  isFull?: Maybe<Scalars["Boolean"]>;
};

export type EventSignUpInput = {
  extraInformation?: InputMaybe<Scalars["String"]>;
};

export type EventType = {
  __typename: "EventType";
  allowedGradeYears?: Maybe<Array<Scalars["Int"]>>;
  availableSlots?: Maybe<Scalars["Int"]>;
  bindingSignup: Scalars["Boolean"];
  category?: Maybe<CategoryType>;
  contactEmail: Scalars["String"];
  deadline?: Maybe<Scalars["DateTime"]>;
  description: Scalars["String"];
  endTime?: Maybe<Scalars["DateTime"]>;
  hasExtraInformation: Scalars["Boolean"];
  id: Scalars["ID"];
  image?: Maybe<Scalars["String"]>;
  isAttendable: Scalars["Boolean"];
  isFull?: Maybe<Scalars["Boolean"]>;
  location?: Maybe<Scalars["String"]>;
  organization: OrganizationType;
  price?: Maybe<Scalars["Float"]>;
  product?: Maybe<ProductType>;
  publisher?: Maybe<UserType>;
  shortDescription?: Maybe<Scalars["String"]>;
  signupOpenDate?: Maybe<Scalars["DateTime"]>;
  startTime: Scalars["DateTime"];
  title: Scalars["String"];
  userAttendance?: Maybe<UserAttendingType>;
  usersAttending?: Maybe<Array<SignUpType>>;
  usersOnWaitingList?: Maybe<Array<SignUpType>>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormType = {
  __typename: "FormType";
  description: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
  organization?: Maybe<OrganizationType>;
  questions: Array<QuestionType>;
  responder?: Maybe<UserType>;
  responders?: Maybe<Array<UserType>>;
  response?: Maybe<ResponseType>;
  responses?: Maybe<Array<ResponseType>>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormTypeResponderArgs = {
  userId: Scalars["ID"];
};

/** A form containing questions, optionally linked to a listing. */
export type FormTypeRespondersArgs = {
  userId?: InputMaybe<Scalars["ID"]>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormTypeResponseArgs = {
  responsePk?: InputMaybe<Scalars["UUID"]>;
};

export type InitiateOrder = {
  __typename: "InitiateOrder";
  orderId?: Maybe<Scalars["UUID"]>;
  redirect?: Maybe<Scalars["String"]>;
};

export type ListingType = {
  __typename: "ListingType";
  applicationUrl?: Maybe<Scalars["String"]>;
  chips: Array<Scalars["String"]>;
  deadline: Scalars["DateTime"];
  description: Scalars["String"];
  endDatetime: Scalars["DateTime"];
  form?: Maybe<FormType>;
  heroImageUrl?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  organization: OrganizationType;
  readMoreUrl?: Maybe<Scalars["String"]>;
  slug: Scalars["String"];
  startDatetime: Scalars["DateTime"];
  title: Scalars["String"];
  viewCount: Scalars["Int"];
};

export type Logout = {
  __typename: "Logout";
  idToken?: Maybe<Scalars["String"]>;
};

export type MembershipInput = {
  groupId?: InputMaybe<Scalars["ID"]>;
  organizationId?: InputMaybe<Scalars["ID"]>;
  userId?: InputMaybe<Scalars["ID"]>;
};

export type MembershipType = {
  __typename: "MembershipType";
  group?: Maybe<ResponsibleGroupType>;
  id: Scalars["ID"];
  organization: OrganizationType;
  user: UserType;
};

export type Mutations = {
  __typename: "Mutations";
  /**
   * Sets the field is_attending to False in the Sign Up for the user with the
   * given ID, for the event with the given ID
   * NOTE: The sign up still exists, it is not deleted from the database
   *       when a user signs off an event
   */
  adminEventSignOff?: Maybe<AdminEventSignOff>;
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
  /** Deletes the listing with the given ID */
  deleteListing?: Maybe<DeleteListing>;
  deleteOrganization?: Maybe<DeleteOrganization>;
  deleteQuestion?: Maybe<DeleteQuestion>;
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
  updateListing?: Maybe<UpdateListing>;
  updateOrganization?: Maybe<UpdateOrganization>;
  updateQuestion?: Maybe<UpdateQuestion>;
  updateUser?: Maybe<UpdateUser>;
};

export type MutationsAdminEventSignOffArgs = {
  eventId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type MutationsAssignMembershipArgs = {
  membershipData: MembershipInput;
};

export type MutationsAttemptCapturePaymentArgs = {
  orderId: Scalars["ID"];
};

export type MutationsAuthUserArgs = {
  code: Scalars["String"];
};

export type MutationsCreateArchivedocumentArgs = {
  date?: InputMaybe<Scalars["DateTime"]>;
  fileLocation?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
  typeDoc?: InputMaybe<Scalars["String"]>;
  webLink?: InputMaybe<Scalars["String"]>;
};

export type MutationsCreateBlogArgs = {
  description?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  organizationId?: InputMaybe<Scalars["ID"]>;
};

export type MutationsCreateBlogPostArgs = {
  authorId?: InputMaybe<Scalars["ID"]>;
  blogId?: InputMaybe<Scalars["ID"]>;
  text?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
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
  listingId?: InputMaybe<Scalars["ID"]>;
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
  formId?: InputMaybe<Scalars["ID"]>;
  questionData: CreateQuestionInput;
};

export type MutationsCreateUpdateAndDeleteOptionsArgs = {
  optionData?: InputMaybe<Array<OptionInput>>;
  questionId: Scalars["ID"];
};

export type MutationsDeleteAnswerArgs = {
  uuid: Scalars["ID"];
};

export type MutationsDeleteAnswersArgs = {
  formId?: InputMaybe<Scalars["ID"]>;
};

export type MutationsDeleteArchivedocumentArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

export type MutationsDeleteBlogArgs = {
  blogId?: InputMaybe<Scalars["ID"]>;
};

export type MutationsDeleteBlogPostArgs = {
  blogPostId?: InputMaybe<Scalars["ID"]>;
};

export type MutationsDeleteBookingArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

export type MutationsDeleteCategoryArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

export type MutationsDeleteEventArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

export type MutationsDeleteFormArgs = {
  id: Scalars["ID"];
};

export type MutationsDeleteListingArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

export type MutationsDeleteOrganizationArgs = {
  id: Scalars["ID"];
};

export type MutationsDeleteQuestionArgs = {
  id: Scalars["ID"];
};

export type MutationsEventSignOffArgs = {
  eventId: Scalars["ID"];
};

export type MutationsEventSignUpArgs = {
  data?: InputMaybe<EventSignUpInput>;
  eventId: Scalars["ID"];
};

export type MutationsInitiateOrderArgs = {
  fallbackRedirect?: InputMaybe<Scalars["String"]>;
  productId: Scalars["ID"];
  quantity?: InputMaybe<Scalars["Int"]>;
};

export type MutationsSendEmailArgs = {
  emailInput?: InputMaybe<EmailInput>;
};

export type MutationsSendEventMailsArgs = {
  content?: InputMaybe<Scalars["String"]>;
  eventId: Scalars["ID"];
  receiverEmails?: InputMaybe<Array<Scalars["String"]>>;
  subject: Scalars["String"];
};

export type MutationsSubmitAnswersArgs = {
  answersData?: InputMaybe<Array<AnswerInput>>;
  formId: Scalars["ID"];
};

export type MutationsUpdateArchivedocumentArgs = {
  date?: InputMaybe<Scalars["DateTime"]>;
  fileLocation?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  title?: InputMaybe<Scalars["String"]>;
  typeDoc?: InputMaybe<Scalars["String"]>;
  webLink?: InputMaybe<Scalars["String"]>;
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
  id: Scalars["ID"];
};

export type MutationsUpdateEventArgs = {
  eventData?: InputMaybe<UpdateEventInput>;
  id: Scalars["ID"];
};

export type MutationsUpdateFormArgs = {
  formData: BaseFormInput;
  id?: InputMaybe<Scalars["ID"]>;
};

export type MutationsUpdateListingArgs = {
  id: Scalars["ID"];
  listingData?: InputMaybe<BaseListingInput>;
};

export type MutationsUpdateOrganizationArgs = {
  id: Scalars["ID"];
  organizationData?: InputMaybe<OrganizationInput>;
};

export type MutationsUpdateQuestionArgs = {
  id: Scalars["ID"];
  questionData: BaseQuestionInput;
};

export type MutationsUpdateUserArgs = {
  userData?: InputMaybe<UserInput>;
};

export type OptionInput = {
  answer: Scalars["String"];
  id?: InputMaybe<Scalars["ID"]>;
};

/** Option for multiple choice questions */
export type OptionType = {
  __typename: "OptionType";
  answer: Scalars["String"];
  id: Scalars["ID"];
  question: QuestionType;
};

export type OrderType = {
  __typename: "OrderType";
  id: Scalars["UUID"];
  paymentStatus: PaymentStatus;
  product: ProductType;
  quantity: Scalars["Int"];
  timestamp: Scalars["DateTime"];
  totalPrice: Scalars["Decimal"];
  user: UserType;
};

export type OrdersByStatusType = {
  __typename: "OrdersByStatusType";
  length?: Maybe<Scalars["Int"]>;
  orders?: Maybe<Array<OrderType>>;
};

export type OrganizationInput = {
  description?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  parentId?: InputMaybe<Scalars["ID"]>;
};

export type OrganizationType = {
  __typename: "OrganizationType";
  absoluteSlug?: Maybe<Scalars["String"]>;
  children: Array<OrganizationType>;
  color?: Maybe<Scalars["String"]>;
  description: Scalars["String"];
  events: Array<EventType>;
  hrGroup?: Maybe<ResponsibleGroupType>;
  id: Scalars["ID"];
  listings?: Maybe<Array<ListingType>>;
  logoUrl?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  parent?: Maybe<OrganizationType>;
  primaryGroup?: Maybe<ResponsibleGroupType>;
  slug: Scalars["String"];
  users: Array<UserType>;
};

/** An enumeration. */
export enum PaymentStatus {
  Cancelled = "CANCELLED",
  Captured = "CAPTURED",
  Failed = "FAILED",
  Initiated = "INITIATED",
  Refunded = "REFUNDED",
  Rejected = "REJECTED",
  Reserved = "RESERVED",
}

export type ProductType = {
  __typename: "ProductType";
  description: Scalars["String"];
  id: Scalars["ID"];
  maxBuyableQuantity: Scalars["Int"];
  name: Scalars["String"];
  price: Scalars["Decimal"];
};

export type Queries = {
  __typename: "Queries";
  activeBookingResponsible?: Maybe<BookingResponsibleType>;
  adminAllBookings?: Maybe<Array<AdminBookingType>>;
  allBlogPosts?: Maybe<Array<BlogPostType>>;
  allBlogs?: Maybe<Array<BlogType>>;
  allBookings?: Maybe<Array<AllBookingsType>>;
  allCategories?: Maybe<Array<CategoryType>>;
  allEvents?: Maybe<Array<EventType>>;
  allOrganizations?: Maybe<Array<OrganizationType>>;
  allUsers?: Maybe<Array<UserType>>;
  archiveByTypes: Array<ArchiveDocumentType>;
  attendeeReport?: Maybe<Scalars["String"]>;
  attendeeReportOrg?: Maybe<Scalars["String"]>;
  attendeeReports?: Maybe<Scalars["String"]>;
  availableYears: Array<Scalars["String"]>;
  blog?: Maybe<BlogType>;
  blogPost?: Maybe<BlogPostType>;
  bookingSemester?: Maybe<UpdateBookingSemesterType>;
  cabins?: Maybe<Array<CabinType>>;
  category?: Maybe<CategoryType>;
  defaultEvents?: Maybe<Array<EventType>>;
  event?: Maybe<EventType>;
  eventFilteredOrganizations?: Maybe<Array<OrganizationType>>;
  featuredArchive: Array<ArchiveDocumentType>;
  form?: Maybe<FormType>;
  forms?: Maybe<Array<FormType>>;
  hasPermission?: Maybe<Scalars["Boolean"]>;
  listing?: Maybe<ListingType>;
  listings?: Maybe<Array<ListingType>>;
  logout: Scalars["String"];
  memberships?: Maybe<Array<MembershipType>>;
  order?: Maybe<OrderType>;
  ordersByStatus?: Maybe<OrdersByStatusType>;
  organization?: Maybe<OrganizationType>;
  product?: Maybe<ProductType>;
  products?: Maybe<Array<ProductType>>;
  response?: Maybe<ResponseType>;
  responses?: Maybe<Array<ResponseType>>;
  serverTime?: Maybe<Scalars["DateTime"]>;
  signUps?: Maybe<SignUpType>;
  user?: Maybe<UserType>;
  userOrders?: Maybe<Array<OrderType>>;
};

export type QueriesAdminAllBookingsArgs = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
};

export type QueriesAllEventsArgs = {
  category?: InputMaybe<Scalars["String"]>;
  endTime?: InputMaybe<Scalars["DateTime"]>;
  organization?: InputMaybe<Scalars["String"]>;
  startTime?: InputMaybe<Scalars["DateTime"]>;
};

export type QueriesAllOrganizationsArgs = {
  search?: InputMaybe<Scalars["String"]>;
};

export type QueriesArchiveByTypesArgs = {
  names?: InputMaybe<Scalars["String"]>;
  typeDoc: Array<InputMaybe<Scalars["String"]>>;
  year?: InputMaybe<Scalars["Int"]>;
};

export type QueriesAttendeeReportArgs = {
  eventId: Scalars["ID"];
  fields?: InputMaybe<Array<Scalars["String"]>>;
  filetype?: InputMaybe<Scalars["String"]>;
};

export type QueriesAttendeeReportOrgArgs = {
  fields?: InputMaybe<Array<Scalars["String"]>>;
  filetype?: InputMaybe<Scalars["String"]>;
  orgId: Scalars["ID"];
};

export type QueriesAttendeeReportsArgs = {
  eventIds: Array<Scalars["ID"]>;
  fields?: InputMaybe<Array<Scalars["String"]>>;
  filetype?: InputMaybe<Scalars["String"]>;
};

export type QueriesBlogArgs = {
  blogId: Scalars["ID"];
};

export type QueriesBlogPostArgs = {
  blogPostId: Scalars["ID"];
};

export type QueriesCategoryArgs = {
  id: Scalars["ID"];
};

export type QueriesEventArgs = {
  id: Scalars["ID"];
};

export type QueriesFormArgs = {
  formId?: InputMaybe<Scalars["ID"]>;
};

export type QueriesHasPermissionArgs = {
  permission: Scalars["String"];
};

export type QueriesListingArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

export type QueriesListingsArgs = {
  search?: InputMaybe<Scalars["String"]>;
};

export type QueriesMembershipsArgs = {
  organizationId?: InputMaybe<Scalars["ID"]>;
};

export type QueriesOrderArgs = {
  orderId: Scalars["ID"];
};

export type QueriesOrdersByStatusArgs = {
  productId: Scalars["ID"];
  status: Scalars["String"];
};

export type QueriesOrganizationArgs = {
  id?: InputMaybe<Scalars["ID"]>;
  slug?: InputMaybe<Scalars["String"]>;
};

export type QueriesProductArgs = {
  productId: Scalars["ID"];
};

export type QueriesResponseArgs = {
  formId: Scalars["ID"];
  responseId?: InputMaybe<Scalars["ID"]>;
};

export type QueriesResponsesArgs = {
  formId: Scalars["ID"];
};

export type QueriesSignUpsArgs = {
  eventId: Scalars["ID"];
};

/** A question on a form. */
export type QuestionType = {
  __typename: "QuestionType";
  answer?: Maybe<AnswerType>;
  answers?: Maybe<Array<AnswerType>>;
  description: Scalars["String"];
  id: Scalars["ID"];
  mandatory: Scalars["Boolean"];
  options?: Maybe<Array<OptionType>>;
  question: Scalars["String"];
  questionType?: Maybe<QuestionTypeEnum>;
};

/** A question on a form. */
export type QuestionTypeAnswersArgs = {
  userId?: InputMaybe<Scalars["ID"]>;
};

export enum QuestionTypeEnum {
  Checkboxes = "CHECKBOXES",
  Dropdown = "DROPDOWN",
  FileUpload = "FILE_UPLOAD",
  MultipleChoice = "MULTIPLE_CHOICE",
  Paragraph = "PARAGRAPH",
  ShortAnswer = "SHORT_ANSWER",
  Slider = "SLIDER",
}

/** An enumeration. */
export enum ResponseStatus {
  /** Red */
  A_0 = "A_0",
  /** Yellow */
  A_1 = "A_1",
  /** Green */
  A_2 = "A_2",
  /** Unknown */
  None = "NONE",
}

/** A response instance that contains information about a user's response to a form. */
export type ResponseType = {
  __typename: "ResponseType";
  answers: Array<AnswerType>;
  form: FormType;
  id?: Maybe<Scalars["UUID"]>;
  questions?: Maybe<Array<QuestionType>>;
  respondent: UserType;
  status?: Maybe<ResponseStatus>;
  uuid: Scalars["UUID"];
};

export type ResponsibleGroupType = {
  __typename: "ResponsibleGroupType";
  description?: Maybe<Scalars["String"]>;
  groupType: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
  organization: OrganizationType;
  uuid: Scalars["UUID"];
};

/** Sends email to the user or an admin (or both) */
export type SendEmail = {
  __typename: "SendEmail";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Send an email to all users signed up to an event */
export type SendEventEmails = {
  __typename: "SendEventEmails";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type SignUpType = {
  __typename: "SignUpType";
  event: EventType;
  extraInformation: Scalars["String"];
  hasBoughtTicket?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  isAttending: Scalars["Boolean"];
  timestamp: Scalars["DateTime"];
  user: UserType;
  userAllergies?: Maybe<Scalars["String"]>;
  userEmail: Scalars["String"];
  userGradeYear: Scalars["Int"];
  userPhoneNumber: Scalars["String"];
};

export type SubmitOrUpdateAnswers = {
  __typename: "SubmitOrUpdateAnswers";
  message?: Maybe<Scalars["String"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateArchiveDocument = {
  __typename: "UpdateArchiveDocument";
  event?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateBlog = {
  __typename: "UpdateBlog";
  blog?: Maybe<BlogType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateBlogInput = {
  description?: InputMaybe<Scalars["String"]>;
  id: Scalars["ID"];
  name?: InputMaybe<Scalars["String"]>;
  organizationId?: InputMaybe<Scalars["ID"]>;
};

export type UpdateBlogPost = {
  __typename: "UpdateBlogPost";
  blogPost?: Maybe<BlogPostType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateBlogPostInput = {
  blogId?: InputMaybe<Scalars["ID"]>;
  id: Scalars["ID"];
  text?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

/** Change the given booking */
export type UpdateBooking = {
  __typename: "UpdateBooking";
  booking?: Maybe<AllBookingsType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateBookingInput = {
  cabins?: InputMaybe<Array<Scalars["Int"]>>;
  checkIn?: InputMaybe<Scalars["Date"]>;
  checkOut?: InputMaybe<Scalars["Date"]>;
  declineReason?: InputMaybe<Scalars["String"]>;
  externalParticipants?: InputMaybe<Scalars["Int"]>;
  extraInfo?: InputMaybe<Scalars["String"]>;
  firstName?: InputMaybe<Scalars["String"]>;
  id: Scalars["ID"];
  internalParticipants?: InputMaybe<Scalars["Int"]>;
  isDeclined?: InputMaybe<Scalars["Boolean"]>;
  isTentative?: InputMaybe<Scalars["Boolean"]>;
  lastName?: InputMaybe<Scalars["String"]>;
  phone?: InputMaybe<Scalars["String"]>;
  receiverEmail?: InputMaybe<Scalars["String"]>;
};

/** Update the booking semester */
export type UpdateBookingSemester = {
  __typename: "UpdateBookingSemester";
  bookingSemester?: Maybe<UpdateBookingSemesterType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateBookingSemesterInput = {
  fallEndDate?: InputMaybe<Scalars["Date"]>;
  fallSemesterActive?: InputMaybe<Scalars["Boolean"]>;
  fallStartDate?: InputMaybe<Scalars["Date"]>;
  springEndDate?: InputMaybe<Scalars["Date"]>;
  springSemesterActive?: InputMaybe<Scalars["Boolean"]>;
  springStartDate?: InputMaybe<Scalars["Date"]>;
};

export type UpdateBookingSemesterType = {
  __typename: "UpdateBookingSemesterType";
  fallEndDate: Scalars["Date"];
  fallSemesterActive: Scalars["Boolean"];
  fallStartDate: Scalars["Date"];
  id: Scalars["ID"];
  springEndDate: Scalars["Date"];
  springSemesterActive: Scalars["Boolean"];
  springStartDate: Scalars["Date"];
};

/** Change the given cabin */
export type UpdateCabin = {
  __typename: "UpdateCabin";
  cabin?: Maybe<CabinType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateCabinInput = {
  externalPrice?: InputMaybe<Scalars["Int"]>;
  id?: InputMaybe<Scalars["ID"]>;
  internalPrice?: InputMaybe<Scalars["Int"]>;
  maxGuests?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<Scalars["String"]>;
};

/** Updates the category with a given ID with the data in category_data */
export type UpdateCategory = {
  __typename: "UpdateCategory";
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Updates the event with a given ID with the data in event_data */
export type UpdateEvent = {
  __typename: "UpdateEvent";
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateEventInput = {
  allowedGradeYears?: InputMaybe<Array<Scalars["Int"]>>;
  availableSlots?: InputMaybe<Scalars["Int"]>;
  bindingSignup?: InputMaybe<Scalars["Boolean"]>;
  categoryId?: InputMaybe<Scalars["ID"]>;
  contactEmail?: InputMaybe<Scalars["String"]>;
  deadline?: InputMaybe<Scalars["DateTime"]>;
  description?: InputMaybe<Scalars["String"]>;
  endTime?: InputMaybe<Scalars["DateTime"]>;
  hasExtraInformation?: InputMaybe<Scalars["Boolean"]>;
  image?: InputMaybe<Scalars["String"]>;
  isAttendable?: InputMaybe<Scalars["Boolean"]>;
  location?: InputMaybe<Scalars["String"]>;
  organizationId?: InputMaybe<Scalars["ID"]>;
  price?: InputMaybe<Scalars["Float"]>;
  shortDescription?: InputMaybe<Scalars["String"]>;
  signupOpenDate?: InputMaybe<Scalars["DateTime"]>;
  startTime?: InputMaybe<Scalars["DateTime"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateForm = {
  __typename: "UpdateForm";
  form?: Maybe<FormType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateListing = {
  __typename: "UpdateListing";
  listing?: Maybe<ListingType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateOrganization = {
  __typename: "UpdateOrganization";
  ok?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<OrganizationType>;
};

export type UpdateQuestion = {
  __typename: "UpdateQuestion";
  ok?: Maybe<Scalars["Boolean"]>;
  question?: Maybe<QuestionType>;
};

export type UpdateUser = {
  __typename: "UpdateUser";
  user?: Maybe<UserType>;
};

export type UserAttendingType = {
  __typename: "UserAttendingType";
  hasBoughtTicket?: Maybe<Scalars["Boolean"]>;
  isOnWaitingList?: Maybe<Scalars["Boolean"]>;
  isSignedUp?: Maybe<Scalars["Boolean"]>;
  positionOnWaitingList?: Maybe<Scalars["Int"]>;
};

export type UserInput = {
  allergies?: InputMaybe<Scalars["String"]>;
  email?: InputMaybe<Scalars["String"]>;
  firstName?: InputMaybe<Scalars["String"]>;
  graduationYear?: InputMaybe<Scalars["Int"]>;
  lastName?: InputMaybe<Scalars["String"]>;
  phoneNumber?: InputMaybe<Scalars["String"]>;
};

export type UserType = {
  __typename: "UserType";
  allergies?: Maybe<Scalars["String"]>;
  canUpdateYear?: Maybe<Scalars["Boolean"]>;
  dateJoined: Scalars["DateTime"];
  email: Scalars["String"];
  events?: Maybe<Array<EventType>>;
  feideEmail: Scalars["String"];
  feideUserid: Scalars["String"];
  firstLogin: Scalars["Boolean"];
  firstName: Scalars["String"];
  gradeYear?: Maybe<Scalars["Int"]>;
  graduationYear?: Maybe<Scalars["Int"]>;
  id: Scalars["ID"];
  idToken: Scalars["String"];
  lastLogin?: Maybe<Scalars["DateTime"]>;
  lastName: Scalars["String"];
  memberships: Array<MembershipType>;
  organizations: Array<OrganizationType>;
  phoneNumber: Scalars["String"];
  responses: Array<ResponseType>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars["String"];
  yearUpdatedAt?: Maybe<Scalars["DateTime"]>;
};

export type LoginRequiredQueryVariables = Exact<{ [key: string]: never }>;

export type LoginRequiredQuery = { __typename: "Queries"; user?: { __typename: "UserType"; id: string } | null };

export type HasPermissionQueryVariables = Exact<{
  permission: Scalars["String"];
}>;

export type HasPermissionQuery = { __typename: "Queries"; hasPermission?: boolean | null };

export type SignUpMutationVariables = Exact<{
  eventId: Scalars["ID"];
  extraInformation?: InputMaybe<Scalars["String"]>;
}>;

export type SignUpMutation = {
  __typename: "Mutations";
  eventSignUp?: {
    __typename: "EventSignUp";
    event?: {
      __typename: "EventType";
      id: string;
      title: string;
      description: string;
      shortDescription?: string | null;
      startTime: string;
      endTime?: string | null;
      location?: string | null;
      contactEmail: string;
      allowedGradeYears?: Array<number> | null;
      hasExtraInformation: boolean;
      isFull?: boolean | null;
      signupOpenDate?: string | null;
      deadline?: string | null;
      isAttendable: boolean;
      bindingSignup: boolean;
      price?: number | null;
      product?: { __typename: "ProductType"; id: string } | null;
      userAttendance?: {
        __typename: "UserAttendingType";
        isSignedUp?: boolean | null;
        isOnWaitingList?: boolean | null;
        positionOnWaitingList?: number | null;
        hasBoughtTicket?: boolean | null;
      } | null;
      category?: { __typename: "CategoryType"; id: string; name: string } | null;
      organization: { __typename: "OrganizationType"; id: string; name: string; logoUrl?: string | null };
    } | null;
  } | null;
};

export type SignOffMutationVariables = Exact<{
  eventId: Scalars["ID"];
}>;

export type SignOffMutation = {
  __typename: "Mutations";
  eventSignOff?: {
    __typename: "EventSignOff";
    event?: {
      __typename: "EventType";
      id: string;
      title: string;
      description: string;
      shortDescription?: string | null;
      startTime: string;
      endTime?: string | null;
      location?: string | null;
      contactEmail: string;
      allowedGradeYears?: Array<number> | null;
      hasExtraInformation: boolean;
      isFull?: boolean | null;
      signupOpenDate?: string | null;
      deadline?: string | null;
      isAttendable: boolean;
      bindingSignup: boolean;
      price?: number | null;
      product?: { __typename: "ProductType"; id: string } | null;
      userAttendance?: {
        __typename: "UserAttendingType";
        isSignedUp?: boolean | null;
        isOnWaitingList?: boolean | null;
        positionOnWaitingList?: number | null;
        hasBoughtTicket?: boolean | null;
      } | null;
      category?: { __typename: "CategoryType"; id: string; name: string } | null;
      organization: { __typename: "OrganizationType"; id: string; name: string; logoUrl?: string | null };
    } | null;
  } | null;
};

export type ServerTimeQueryVariables = Exact<{ [key: string]: never }>;

export type ServerTimeQuery = { __typename: "Queries"; serverTime?: string | null };

export type EventDetailFieldsFragment = {
  __typename: "EventType";
  id: string;
  title: string;
  description: string;
  shortDescription?: string | null;
  startTime: string;
  endTime?: string | null;
  location?: string | null;
  contactEmail: string;
  allowedGradeYears?: Array<number> | null;
  hasExtraInformation: boolean;
  isFull?: boolean | null;
  signupOpenDate?: string | null;
  deadline?: string | null;
  isAttendable: boolean;
  bindingSignup: boolean;
  price?: number | null;
  product?: { __typename: "ProductType"; id: string } | null;
  userAttendance?: {
    __typename: "UserAttendingType";
    isSignedUp?: boolean | null;
    isOnWaitingList?: boolean | null;
    positionOnWaitingList?: number | null;
    hasBoughtTicket?: boolean | null;
  } | null;
  category?: { __typename: "CategoryType"; id: string; name: string } | null;
  organization: { __typename: "OrganizationType"; id: string; name: string; logoUrl?: string | null };
};

export type EventUserOrganizationsQueryVariables = Exact<{ [key: string]: never }>;

export type EventUserOrganizationsQuery = {
  __typename: "Queries";
  user?: {
    __typename: "UserType";
    id: string;
    organizations: Array<{ __typename: "OrganizationType"; id: string }>;
  } | null;
};

export type EventQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type EventQuery = {
  __typename: "Queries";
  event?: {
    __typename: "EventType";
    id: string;
    title: string;
    description: string;
    shortDescription?: string | null;
    startTime: string;
    endTime?: string | null;
    location?: string | null;
    contactEmail: string;
    allowedGradeYears?: Array<number> | null;
    hasExtraInformation: boolean;
    isFull?: boolean | null;
    signupOpenDate?: string | null;
    deadline?: string | null;
    isAttendable: boolean;
    bindingSignup: boolean;
    price?: number | null;
    product?: { __typename: "ProductType"; id: string } | null;
    userAttendance?: {
      __typename: "UserAttendingType";
      isSignedUp?: boolean | null;
      isOnWaitingList?: boolean | null;
      positionOnWaitingList?: number | null;
      hasBoughtTicket?: boolean | null;
    } | null;
    category?: { __typename: "CategoryType"; id: string; name: string } | null;
    organization: { __typename: "OrganizationType"; id: string; name: string; logoUrl?: string | null };
  } | null;
  user?: {
    __typename: "UserType";
    id: string;
    organizations: Array<{ __typename: "OrganizationType"; id: string }>;
  } | null;
};

export type UserQueryVariables = Exact<{ [key: string]: never }>;

export type UserQuery = {
  __typename: "Queries";
  user?: { __typename: "UserType"; id: string; firstName: string } | null;
};

export const EventDetailFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EventDetailFields" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "shortDescription" } },
          { kind: "Field", name: { kind: "Name", value: "startTime" } },
          { kind: "Field", name: { kind: "Name", value: "endTime" } },
          { kind: "Field", name: { kind: "Name", value: "location" } },
          { kind: "Field", name: { kind: "Name", value: "contactEmail" } },
          { kind: "Field", name: { kind: "Name", value: "allowedGradeYears" } },
          { kind: "Field", name: { kind: "Name", value: "hasExtraInformation" } },
          { kind: "Field", name: { kind: "Name", value: "isFull" } },
          { kind: "Field", name: { kind: "Name", value: "signupOpenDate" } },
          { kind: "Field", name: { kind: "Name", value: "deadline" } },
          { kind: "Field", name: { kind: "Name", value: "isAttendable" } },
          { kind: "Field", name: { kind: "Name", value: "bindingSignup" } },
          { kind: "Field", name: { kind: "Name", value: "price" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "product" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "userAttendance" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "isSignedUp" } },
                { kind: "Field", name: { kind: "Name", value: "isOnWaitingList" } },
                { kind: "Field", name: { kind: "Name", value: "positionOnWaitingList" } },
                { kind: "Field", name: { kind: "Name", value: "hasBoughtTicket" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "category" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "organization" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "logoUrl" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventDetailFieldsFragment, unknown>;
export const LoginRequiredDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "LoginRequired" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginRequiredQuery, LoginRequiredQueryVariables>;
export const HasPermissionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "hasPermission" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "permission" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "hasPermission" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "permission" },
                value: { kind: "Variable", name: { kind: "Name", value: "permission" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HasPermissionQuery, HasPermissionQueryVariables>;
export const SignUpDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SignUp" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "eventId" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "extraInformation" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "eventSignUp" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "eventId" },
                value: { kind: "Variable", name: { kind: "Name", value: "eventId" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "data" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "extraInformation" },
                      value: { kind: "Variable", name: { kind: "Name", value: "extraInformation" } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "event" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "EventDetailFields" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EventDetailFields" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "shortDescription" } },
          { kind: "Field", name: { kind: "Name", value: "startTime" } },
          { kind: "Field", name: { kind: "Name", value: "endTime" } },
          { kind: "Field", name: { kind: "Name", value: "location" } },
          { kind: "Field", name: { kind: "Name", value: "contactEmail" } },
          { kind: "Field", name: { kind: "Name", value: "allowedGradeYears" } },
          { kind: "Field", name: { kind: "Name", value: "hasExtraInformation" } },
          { kind: "Field", name: { kind: "Name", value: "isFull" } },
          { kind: "Field", name: { kind: "Name", value: "signupOpenDate" } },
          { kind: "Field", name: { kind: "Name", value: "deadline" } },
          { kind: "Field", name: { kind: "Name", value: "isAttendable" } },
          { kind: "Field", name: { kind: "Name", value: "bindingSignup" } },
          { kind: "Field", name: { kind: "Name", value: "price" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "product" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "userAttendance" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "isSignedUp" } },
                { kind: "Field", name: { kind: "Name", value: "isOnWaitingList" } },
                { kind: "Field", name: { kind: "Name", value: "positionOnWaitingList" } },
                { kind: "Field", name: { kind: "Name", value: "hasBoughtTicket" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "category" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "organization" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "logoUrl" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const SignOffDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SignOff" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "eventId" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "eventSignOff" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "eventId" },
                value: { kind: "Variable", name: { kind: "Name", value: "eventId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "event" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "EventDetailFields" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EventDetailFields" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "shortDescription" } },
          { kind: "Field", name: { kind: "Name", value: "startTime" } },
          { kind: "Field", name: { kind: "Name", value: "endTime" } },
          { kind: "Field", name: { kind: "Name", value: "location" } },
          { kind: "Field", name: { kind: "Name", value: "contactEmail" } },
          { kind: "Field", name: { kind: "Name", value: "allowedGradeYears" } },
          { kind: "Field", name: { kind: "Name", value: "hasExtraInformation" } },
          { kind: "Field", name: { kind: "Name", value: "isFull" } },
          { kind: "Field", name: { kind: "Name", value: "signupOpenDate" } },
          { kind: "Field", name: { kind: "Name", value: "deadline" } },
          { kind: "Field", name: { kind: "Name", value: "isAttendable" } },
          { kind: "Field", name: { kind: "Name", value: "bindingSignup" } },
          { kind: "Field", name: { kind: "Name", value: "price" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "product" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "userAttendance" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "isSignedUp" } },
                { kind: "Field", name: { kind: "Name", value: "isOnWaitingList" } },
                { kind: "Field", name: { kind: "Name", value: "positionOnWaitingList" } },
                { kind: "Field", name: { kind: "Name", value: "hasBoughtTicket" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "category" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "organization" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "logoUrl" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignOffMutation, SignOffMutationVariables>;
export const ServerTimeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ServerTime" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [{ kind: "Field", name: { kind: "Name", value: "serverTime" } }],
      },
    },
  ],
} as unknown as DocumentNode<ServerTimeQuery, ServerTimeQueryVariables>;
export const EventUserOrganizationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "eventUserOrganizations" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organizations" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventUserOrganizationsQuery, EventUserOrganizationsQueryVariables>;
export const EventDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "event" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "event" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "EventDetailFields" } }],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organizations" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EventDetailFields" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "shortDescription" } },
          { kind: "Field", name: { kind: "Name", value: "startTime" } },
          { kind: "Field", name: { kind: "Name", value: "endTime" } },
          { kind: "Field", name: { kind: "Name", value: "location" } },
          { kind: "Field", name: { kind: "Name", value: "contactEmail" } },
          { kind: "Field", name: { kind: "Name", value: "allowedGradeYears" } },
          { kind: "Field", name: { kind: "Name", value: "hasExtraInformation" } },
          { kind: "Field", name: { kind: "Name", value: "isFull" } },
          { kind: "Field", name: { kind: "Name", value: "signupOpenDate" } },
          { kind: "Field", name: { kind: "Name", value: "deadline" } },
          { kind: "Field", name: { kind: "Name", value: "isAttendable" } },
          { kind: "Field", name: { kind: "Name", value: "bindingSignup" } },
          { kind: "Field", name: { kind: "Name", value: "price" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "product" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "userAttendance" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "isSignedUp" } },
                { kind: "Field", name: { kind: "Name", value: "isOnWaitingList" } },
                { kind: "Field", name: { kind: "Name", value: "positionOnWaitingList" } },
                { kind: "Field", name: { kind: "Name", value: "hasBoughtTicket" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "category" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "organization" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "logoUrl" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventQuery, EventQueryVariables>;
export const UserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "User" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
