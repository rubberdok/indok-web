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
  Date: any;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: any;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
  /**
   * Leverages the internal Python implmeentation of UUID (uuid.UUID) to provide native UUID objects
   * in fields, resolvers and input.
   */
  UUID: any;
};

/** Booking type for admin users */
export type AdminBookingType = {
  __typename?: "AdminBookingType";
  cabins: Array<CabinType>;
  checkIn: Scalars["Date"];
  checkOut: Scalars["Date"];
  externalParticipants: Scalars["Int"];
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
  __typename?: "AdminEventSignOff";
  event?: Maybe<EventType>;
};

/** Booking type for fields available for not logged in users */
export type AllBookingsType = {
  __typename?: "AllBookingsType";
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
  __typename?: "AnswerType";
  answer: Scalars["String"];
  id?: Maybe<Scalars["UUID"]>;
  question: QuestionType;
  uuid: Scalars["UUID"];
};

export type ArchiveDocumentType = {
  __typename?: "ArchiveDocumentType";
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
  /** Støtte fra HS */
  StotteFraHs = "STOTTE_FRA_HS",
  /** Utveksling */
  Utveksling = "UTVEKSLING",
}

export type AssignMembership = {
  __typename?: "AssignMembership";
  membership?: Maybe<MembershipType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type AttemptCapturePayment = {
  __typename?: "AttemptCapturePayment";
  order?: Maybe<OrderType>;
  status?: Maybe<Scalars["String"]>;
};

export type AuthUser = {
  __typename?: "AuthUser";
  idToken?: Maybe<Scalars["String"]>;
  isIndokStudent?: Maybe<Scalars["Boolean"]>;
  token?: Maybe<Scalars["String"]>;
  user?: Maybe<UserType>;
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
  __typename?: "BlogPostType";
  author?: Maybe<UserType>;
  blog?: Maybe<BlogType>;
  id: Scalars["ID"];
  publishDate: Scalars["DateTime"];
  text: Scalars["String"];
  title: Scalars["String"];
};

export type BlogType = {
  __typename?: "BlogType";
  blogPosts: Array<BlogPostType>;
  description: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
  organization?: Maybe<OrganizationType>;
};

/** Basic booking object type used as a base for other types and as a standalone */
export type BookingInput = {
  cabins?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  checkIn?: InputMaybe<Scalars["Date"]>;
  checkOut?: InputMaybe<Scalars["Date"]>;
  externalParticipants?: InputMaybe<Scalars["Int"]>;
  firstName?: InputMaybe<Scalars["String"]>;
  internalParticipants?: InputMaybe<Scalars["Int"]>;
  lastName?: InputMaybe<Scalars["String"]>;
  phone?: InputMaybe<Scalars["String"]>;
  receiverEmail?: InputMaybe<Scalars["String"]>;
};

export type BookingResponsibleType = {
  __typename?: "BookingResponsibleType";
  active?: Maybe<Scalars["Boolean"]>;
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lastName?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["Int"]>;
};

export type CabinType = {
  __typename?: "CabinType";
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
  __typename?: "CategoryType";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type CreateArchiveDocument = {
  __typename?: "CreateArchiveDocument";
  arhiveDocument?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateBlog = {
  __typename?: "CreateBlog";
  blog?: Maybe<BlogType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateBlogPost = {
  __typename?: "CreateBlogPost";
  blogPost?: Maybe<BlogPostType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Add a new booking to the database */
export type CreateBooking = {
  __typename?: "CreateBooking";
  booking?: Maybe<AllBookingsType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Create a new event category */
export type CreateCategory = {
  __typename?: "CreateCategory";
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Create a new event */
export type CreateEvent = {
  __typename?: "CreateEvent";
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type CreateEventInput = {
  allowedGradeYears?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
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
  __typename?: "CreateForm";
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
  __typename?: "CreateListing";
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
  __typename?: "CreateOrganization";
  ok?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<OrganizationType>;
};

export type CreateProduct = {
  __typename?: "CreateProduct";
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
  __typename?: "CreateQuestion";
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
  __typename?: "CreateUpdateAndDeleteOptions";
  ok?: Maybe<Scalars["Boolean"]>;
  options?: Maybe<Array<Maybe<OptionType>>>;
};

export type DeleteAnswer = {
  __typename?: "DeleteAnswer";
  deletedUuid?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteAnswersToForm = {
  __typename?: "DeleteAnswersToForm";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteArchiveDocument = {
  __typename?: "DeleteArchiveDocument";
  archiveDocument?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteBlog = {
  __typename?: "DeleteBlog";
  ok?: Maybe<Scalars["ID"]>;
};

export type DeleteBlogPost = {
  __typename?: "DeleteBlogPost";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Deletes the booking with the given ID */
export type DeleteBooking = {
  __typename?: "DeleteBooking";
  bookingId?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Deletes the category with a given ID */
export type DeleteCategory = {
  __typename?: "DeleteCategory";
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Deletes the event with the given ID */
export type DeleteEvent = {
  __typename?: "DeleteEvent";
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteForm = {
  __typename?: "DeleteForm";
  deletedId?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteJsonWebTokenCookie = {
  __typename?: "DeleteJSONWebTokenCookie";
  deleted: Scalars["Boolean"];
};

/** Deletes the listing with the given ID */
export type DeleteListing = {
  __typename?: "DeleteListing";
  listingId?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type DeleteOrganization = {
  __typename?: "DeleteOrganization";
  ok?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<OrganizationType>;
};

export type DeleteQuestion = {
  __typename?: "DeleteQuestion";
  deletedId?: Maybe<Scalars["ID"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type EmailInput = {
  cabins?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
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
  __typename?: "EventSignOff";
  event?: Maybe<EventType>;
  isFull?: Maybe<Scalars["Boolean"]>;
};

/**
 * Creates a new Sign Up for the user that sent the request, for the event
 * with the given ID
 */
export type EventSignUp = {
  __typename?: "EventSignUp";
  event?: Maybe<EventType>;
  isFull?: Maybe<Scalars["Boolean"]>;
};

export type EventSignUpInput = {
  extraInformation?: InputMaybe<Scalars["String"]>;
};

export type EventType = {
  __typename?: "EventType";
  allowedGradeYears?: Maybe<Array<Maybe<Scalars["Int"]>>>;
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
  usersAttending?: Maybe<Array<Maybe<SignUpType>>>;
  usersOnWaitingList?: Maybe<Array<Maybe<SignUpType>>>;
};

/** A form containing questions, optionally linked to a listing. */
export type FormType = {
  __typename?: "FormType";
  description: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
  organization?: Maybe<OrganizationType>;
  questions: Array<QuestionType>;
  responder?: Maybe<UserType>;
  responders?: Maybe<Array<Maybe<UserType>>>;
  response?: Maybe<ResponseType>;
  responses?: Maybe<Array<Maybe<ResponseType>>>;
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

export type GetIdToken = {
  __typename?: "GetIDToken";
  idToken: Scalars["String"];
};

export type InitiateOrder = {
  __typename?: "InitiateOrder";
  orderId?: Maybe<Scalars["UUID"]>;
  redirect?: Maybe<Scalars["String"]>;
};

export type ListingType = {
  __typename?: "ListingType";
  applicationUrl?: Maybe<Scalars["String"]>;
  chips: Array<Maybe<Scalars["String"]>>;
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

export type MembershipInput = {
  groupId?: InputMaybe<Scalars["ID"]>;
  organizationId?: InputMaybe<Scalars["ID"]>;
  userId?: InputMaybe<Scalars["ID"]>;
};

export type MembershipType = {
  __typename?: "MembershipType";
  group?: Maybe<ResponsibleGroupType>;
  id: Scalars["ID"];
  organization: OrganizationType;
  user: UserType;
};

export type Mutations = {
  __typename?: "Mutations";
  /**
   * Sets the field is_attending to False in the Sign Up for the user with the
   * given ID, for the event with the given ID
   * NOTE: The sign up still exists, it is not deleted from the database
   *       when a user signs off an event
   */
  adminEventSignOff?: Maybe<AdminEventSignOff>;
  assignMembership?: Maybe<AssignMembership>;
  attemptCapturePayment?: Maybe<AttemptCapturePayment>;
  authUser?: Maybe<AuthUser>;
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
  deleteTokenCookie?: Maybe<DeleteJsonWebTokenCookie>;
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
  getIdToken?: Maybe<GetIdToken>;
  initiateOrder?: Maybe<InitiateOrder>;
  refreshToken?: Maybe<Refresh>;
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
  /** Updates the category with a given ID with the data in category_data */
  updateCategory?: Maybe<UpdateCategory>;
  /** Updates the event with a given ID with the data in event_data */
  updateEvent?: Maybe<UpdateEvent>;
  updateForm?: Maybe<UpdateForm>;
  updateListing?: Maybe<UpdateListing>;
  updateOrganization?: Maybe<UpdateOrganization>;
  updateQuestion?: Maybe<UpdateQuestion>;
  updateUser?: Maybe<UpdateUser>;
  verifyToken?: Maybe<Verify>;
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
  code?: InputMaybe<Scalars["String"]>;
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
  optionData?: InputMaybe<Array<InputMaybe<OptionInput>>>;
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

export type MutationsRefreshTokenArgs = {
  token?: InputMaybe<Scalars["String"]>;
};

export type MutationsSendEmailArgs = {
  emailInput?: InputMaybe<EmailInput>;
};

export type MutationsSendEventMailsArgs = {
  content?: InputMaybe<Scalars["String"]>;
  eventId: Scalars["ID"];
  receiverEmails?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  subject: Scalars["String"];
};

export type MutationsSubmitAnswersArgs = {
  answersData?: InputMaybe<Array<InputMaybe<AnswerInput>>>;
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

export type MutationsVerifyTokenArgs = {
  token?: InputMaybe<Scalars["String"]>;
};

export type OptionInput = {
  answer: Scalars["String"];
  id?: InputMaybe<Scalars["ID"]>;
};

/** Option for multiple choice questions */
export type OptionType = {
  __typename?: "OptionType";
  answer: Scalars["String"];
  id: Scalars["ID"];
  question: QuestionType;
};

/** An enumeration. */
export enum OrderPaymentStatus {
  /** cancelled */
  Cancelled = "CANCELLED",
  /** captured */
  Captured = "CAPTURED",
  /** failed */
  Failed = "FAILED",
  /** initiated */
  Initiated = "INITIATED",
  /** refunded */
  Refunded = "REFUNDED",
  /** rejected */
  Rejected = "REJECTED",
  /** reserved */
  Reserved = "RESERVED",
}

export type OrderType = {
  __typename?: "OrderType";
  id: Scalars["UUID"];
  paymentStatus: OrderPaymentStatus;
  product: ProductType;
  quantity: Scalars["Int"];
  timestamp: Scalars["DateTime"];
  totalPrice: Scalars["Decimal"];
  user: UserType;
};

export type OrdersByStatusType = {
  __typename?: "OrdersByStatusType";
  length?: Maybe<Scalars["Int"]>;
  orders?: Maybe<Array<Maybe<OrderType>>>;
};

export type OrganizationInput = {
  description?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  parentId?: InputMaybe<Scalars["ID"]>;
};

export type OrganizationType = {
  __typename?: "OrganizationType";
  absoluteSlug?: Maybe<Scalars["String"]>;
  children: Array<OrganizationType>;
  color?: Maybe<Scalars["String"]>;
  description: Scalars["String"];
  events: Array<EventType>;
  hrGroup?: Maybe<ResponsibleGroupType>;
  id: Scalars["ID"];
  listings?: Maybe<Array<Maybe<ListingType>>>;
  logoUrl?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  parent?: Maybe<OrganizationType>;
  primaryGroup?: Maybe<ResponsibleGroupType>;
  slug: Scalars["String"];
  users: Array<UserType>;
};

export type ProductType = {
  __typename?: "ProductType";
  description: Scalars["String"];
  id: Scalars["ID"];
  maxBuyableQuantity: Scalars["Int"];
  name: Scalars["String"];
  price: Scalars["Decimal"];
};

export type Queries = {
  __typename?: "Queries";
  activeBookingResponsible?: Maybe<BookingResponsibleType>;
  adminAllBookings?: Maybe<Array<Maybe<AdminBookingType>>>;
  allBlogPosts?: Maybe<Array<Maybe<BlogPostType>>>;
  allBlogs?: Maybe<Array<Maybe<BlogType>>>;
  allBookings?: Maybe<Array<Maybe<AllBookingsType>>>;
  allCategories?: Maybe<Array<Maybe<CategoryType>>>;
  allEvents?: Maybe<Array<Maybe<EventType>>>;
  allOrganizations?: Maybe<Array<Maybe<OrganizationType>>>;
  allUsers?: Maybe<Array<Maybe<UserType>>>;
  archiveByTypes: Array<ArchiveDocumentType>;
  attendeeReport?: Maybe<Scalars["String"]>;
  attendeeReportOrg?: Maybe<Scalars["String"]>;
  attendeeReports?: Maybe<Scalars["String"]>;
  availableYears: Array<Scalars["String"]>;
  blog?: Maybe<BlogType>;
  blogPost?: Maybe<BlogPostType>;
  bookingSemester?: Maybe<UpdateBookingSemesterType>;
  cabins?: Maybe<Array<Maybe<CabinType>>>;
  category?: Maybe<CategoryType>;
  defaultEvents?: Maybe<Array<Maybe<EventType>>>;
  event?: Maybe<EventType>;
  eventFilteredOrganizations?: Maybe<Array<Maybe<OrganizationType>>>;
  featuredArchive: Array<ArchiveDocumentType>;
  form?: Maybe<FormType>;
  forms?: Maybe<Array<Maybe<FormType>>>;
  hasPermission?: Maybe<Scalars["Boolean"]>;
  listing?: Maybe<ListingType>;
  listings?: Maybe<Array<Maybe<ListingType>>>;
  memberships?: Maybe<Array<Maybe<MembershipType>>>;
  order?: Maybe<OrderType>;
  ordersByStatus?: Maybe<OrdersByStatusType>;
  organization?: Maybe<OrganizationType>;
  product?: Maybe<ProductType>;
  products?: Maybe<Array<Maybe<ProductType>>>;
  response?: Maybe<ResponseType>;
  responses?: Maybe<Array<Maybe<ResponseType>>>;
  serverTime?: Maybe<Scalars["DateTime"]>;
  signUps?: Maybe<SignUpType>;
  user?: Maybe<UserType>;
  userOrders?: Maybe<Array<Maybe<OrderType>>>;
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
  fields?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  filetype?: InputMaybe<Scalars["String"]>;
};

export type QueriesAttendeeReportOrgArgs = {
  fields?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  filetype?: InputMaybe<Scalars["String"]>;
  orgId: Scalars["ID"];
};

export type QueriesAttendeeReportsArgs = {
  eventIds: Array<InputMaybe<Scalars["ID"]>>;
  fields?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
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
  __typename?: "QuestionType";
  answer?: Maybe<AnswerType>;
  answers?: Maybe<Array<Maybe<AnswerType>>>;
  description: Scalars["String"];
  id: Scalars["ID"];
  mandatory: Scalars["Boolean"];
  options?: Maybe<Array<Maybe<OptionType>>>;
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

export type Refresh = {
  __typename?: "Refresh";
  payload: Scalars["GenericScalar"];
  refreshExpiresIn: Scalars["Int"];
  token: Scalars["String"];
};

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
  __typename?: "ResponseType";
  answers: Array<AnswerType>;
  form: FormType;
  id?: Maybe<Scalars["UUID"]>;
  questions?: Maybe<Array<Maybe<QuestionType>>>;
  respondent: UserType;
  status?: Maybe<ResponseStatus>;
  uuid: Scalars["UUID"];
};

export type ResponsibleGroupType = {
  __typename?: "ResponsibleGroupType";
  description?: Maybe<Scalars["String"]>;
  groupType: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
  organization: OrganizationType;
  uuid: Scalars["UUID"];
};

/** Sends email to the user or an admin (or both) */
export type SendEmail = {
  __typename?: "SendEmail";
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Send an email to all users signed up to an event */
export type SendEventEmails = {
  __typename?: "SendEventEmails";
  ok?: Maybe<Scalars["Boolean"]>;
};

export type SignUpType = {
  __typename?: "SignUpType";
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
  __typename?: "SubmitOrUpdateAnswers";
  message?: Maybe<Scalars["String"]>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateArchiveDocument = {
  __typename?: "UpdateArchiveDocument";
  event?: Maybe<ArchiveDocumentType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateBlog = {
  __typename?: "UpdateBlog";
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
  __typename?: "UpdateBlogPost";
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
  __typename?: "UpdateBooking";
  booking?: Maybe<AllBookingsType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateBookingInput = {
  cabins?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
  checkIn?: InputMaybe<Scalars["Date"]>;
  checkOut?: InputMaybe<Scalars["Date"]>;
  externalParticipants?: InputMaybe<Scalars["Int"]>;
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
  __typename?: "UpdateBookingSemester";
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
  __typename?: "UpdateBookingSemesterType";
  fallEndDate: Scalars["Date"];
  fallSemesterActive: Scalars["Boolean"];
  fallStartDate: Scalars["Date"];
  id: Scalars["ID"];
  springEndDate: Scalars["Date"];
  springSemesterActive: Scalars["Boolean"];
  springStartDate: Scalars["Date"];
};

/** Updates the category with a given ID with the data in category_data */
export type UpdateCategory = {
  __typename?: "UpdateCategory";
  category?: Maybe<CategoryType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

/** Updates the event with a given ID with the data in event_data */
export type UpdateEvent = {
  __typename?: "UpdateEvent";
  event?: Maybe<EventType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateEventInput = {
  allowedGradeYears?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
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
  __typename?: "UpdateForm";
  form?: Maybe<FormType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateListing = {
  __typename?: "UpdateListing";
  listing?: Maybe<ListingType>;
  ok?: Maybe<Scalars["Boolean"]>;
};

export type UpdateOrganization = {
  __typename?: "UpdateOrganization";
  ok?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<OrganizationType>;
};

export type UpdateQuestion = {
  __typename?: "UpdateQuestion";
  ok?: Maybe<Scalars["Boolean"]>;
  question?: Maybe<QuestionType>;
};

export type UpdateUser = {
  __typename?: "UpdateUser";
  user?: Maybe<UserType>;
};

export type UserAttendingType = {
  __typename?: "UserAttendingType";
  hasBoughtTicket?: Maybe<Scalars["Boolean"]>;
  isOnWaitingList?: Maybe<Scalars["Boolean"]>;
  isSignedUp?: Maybe<Scalars["Boolean"]>;
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
  __typename?: "UserType";
  allergies?: Maybe<Scalars["String"]>;
  canUpdateYear?: Maybe<Scalars["Boolean"]>;
  dateJoined: Scalars["DateTime"];
  email: Scalars["String"];
  events?: Maybe<Array<Maybe<EventType>>>;
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

export type Verify = {
  __typename?: "Verify";
  payload: Scalars["GenericScalar"];
};

export type ArchiveByTypesQueryVariables = Exact<{
  document_types: Array<InputMaybe<Scalars["String"]>> | InputMaybe<Scalars["String"]>;
  year?: InputMaybe<Scalars["Int"]>;
  names?: InputMaybe<Scalars["String"]>;
}>;

export type ArchiveByTypesQuery = {
  __typename?: "Queries";
  archiveByTypes: Array<{
    __typename?: "ArchiveDocumentType";
    id: string;
    title: string;
    thumbnail?: string | null;
    typeDoc: ArchiveDocumentTypeDoc;
    year?: number | null;
    webLink?: string | null;
  }>;
};

export type FeaturedArchiveQueryVariables = Exact<{ [key: string]: never }>;

export type FeaturedArchiveQuery = {
  __typename?: "Queries";
  featuredArchive: Array<{
    __typename?: "ArchiveDocumentType";
    id: string;
    title: string;
    thumbnail?: string | null;
    featured: boolean;
    typeDoc: ArchiveDocumentTypeDoc;
    year?: number | null;
    webLink?: string | null;
  }>;
};

export type AvailableYearsQueryVariables = Exact<{ [key: string]: never }>;

export type AvailableYearsQuery = { __typename?: "Queries"; availableYears: Array<string> };

export type CreateBookingMutationVariables = Exact<{
  bookingData?: InputMaybe<BookingInput>;
}>;

export type CreateBookingMutation = {
  __typename?: "Mutations";
  createBooking?: { __typename?: "CreateBooking"; ok?: boolean | null } | null;
};

export type SendEmailMutationVariables = Exact<{
  emailInput?: InputMaybe<EmailInput>;
}>;

export type SendEmailMutation = {
  __typename?: "Mutations";
  sendEmail?: { __typename?: "SendEmail"; ok?: boolean | null } | null;
};

export type ConfirmBookingMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ConfirmBookingMutation = {
  __typename?: "Mutations";
  updateBooking?: { __typename?: "UpdateBooking"; ok?: boolean | null } | null;
};

export type DeleteBookingMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteBookingMutation = {
  __typename?: "Mutations";
  deleteBooking?: { __typename?: "DeleteBooking"; ok?: boolean | null } | null;
};

export type AllBookingsQueryVariables = Exact<{ [key: string]: never }>;

export type AllBookingsQuery = {
  __typename?: "Queries";
  allBookings?: Array<{
    __typename?: "AllBookingsType";
    id: string;
    checkIn: any;
    checkOut: any;
    cabins: Array<{ __typename?: "CabinType"; id: string; name: string }>;
  } | null> | null;
};

export type AdminAllBookingsQueryVariables = Exact<{
  after?: InputMaybe<Scalars["String"]>;
}>;

export type AdminAllBookingsQuery = {
  __typename?: "Queries";
  adminAllBookings?: Array<{
    __typename?: "AdminBookingType";
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    receiverEmail: string;
    checkIn: any;
    checkOut: any;
    externalParticipants: number;
    internalParticipants: number;
    price?: number | null;
    isTentative: boolean;
    cabins: Array<{ __typename?: "CabinType"; id: string; name: string }>;
  } | null> | null;
};

export type AllCabinsQueryVariables = Exact<{ [key: string]: never }>;

export type AllCabinsQuery = {
  __typename?: "Queries";
  cabins?: Array<{
    __typename?: "CabinType";
    id: string;
    name: string;
    maxGuests: number;
    internalPrice: number;
    externalPrice: number;
  } | null> | null;
};

export type ActiveBookingResponsibleQueryVariables = Exact<{ [key: string]: never }>;

export type ActiveBookingResponsibleQuery = {
  __typename?: "Queries";
  activeBookingResponsible?: {
    __typename?: "BookingResponsibleType";
    id: string;
    active?: boolean | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
};

export const ArchiveByTypesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "archiveByTypes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "document_types" } },
          type: {
            kind: "NonNullType",
            type: { kind: "ListType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "year" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "names" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "archiveByTypes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "typeDoc" },
                value: { kind: "Variable", name: { kind: "Name", value: "document_types" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "year" },
                value: { kind: "Variable", name: { kind: "Name", value: "year" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "names" },
                value: { kind: "Variable", name: { kind: "Name", value: "names" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "thumbnail" } },
                { kind: "Field", name: { kind: "Name", value: "typeDoc" } },
                { kind: "Field", name: { kind: "Name", value: "year" } },
                { kind: "Field", name: { kind: "Name", value: "webLink" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ArchiveByTypesQuery, ArchiveByTypesQueryVariables>;
export const FeaturedArchiveDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "featuredArchive" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "featuredArchive" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "thumbnail" } },
                { kind: "Field", name: { kind: "Name", value: "featured" } },
                { kind: "Field", name: { kind: "Name", value: "typeDoc" } },
                { kind: "Field", name: { kind: "Name", value: "year" } },
                { kind: "Field", name: { kind: "Name", value: "webLink" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FeaturedArchiveQuery, FeaturedArchiveQueryVariables>;
export const AvailableYearsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "availableYears" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [{ kind: "Field", name: { kind: "Name", value: "availableYears" } }],
      },
    },
  ],
} as unknown as DocumentNode<AvailableYearsQuery, AvailableYearsQueryVariables>;
export const CreateBookingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateBooking" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "bookingData" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "BookingInput" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createBooking" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "bookingData" },
                value: { kind: "Variable", name: { kind: "Name", value: "bookingData" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "ok" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateBookingMutation, CreateBookingMutationVariables>;
export const SendEmailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SendEmail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "emailInput" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "EmailInput" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sendEmail" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "emailInput" },
                value: { kind: "Variable", name: { kind: "Name", value: "emailInput" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "ok" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SendEmailMutation, SendEmailMutationVariables>;
export const ConfirmBookingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ConfirmBooking" },
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
            name: { kind: "Name", value: "updateBooking" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "bookingData" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "isTentative" },
                      value: { kind: "BooleanValue", value: false },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "ok" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ConfirmBookingMutation, ConfirmBookingMutationVariables>;
export const DeleteBookingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteBooking" },
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
            name: { kind: "Name", value: "deleteBooking" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "ok" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteBookingMutation, DeleteBookingMutationVariables>;
export const AllBookingsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AllBookings" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "allBookings" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "checkIn" } },
                { kind: "Field", name: { kind: "Name", value: "checkOut" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "cabins" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AllBookingsQuery, AllBookingsQueryVariables>;
export const AdminAllBookingsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AdminAllBookings" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "adminAllBookings" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "after" },
                value: { kind: "Variable", name: { kind: "Name", value: "after" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
                { kind: "Field", name: { kind: "Name", value: "lastName" } },
                { kind: "Field", name: { kind: "Name", value: "phone" } },
                { kind: "Field", name: { kind: "Name", value: "receiverEmail" } },
                { kind: "Field", name: { kind: "Name", value: "checkIn" } },
                { kind: "Field", name: { kind: "Name", value: "checkOut" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "cabins" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "externalParticipants" } },
                { kind: "Field", name: { kind: "Name", value: "internalParticipants" } },
                { kind: "Field", name: { kind: "Name", value: "price" } },
                { kind: "Field", name: { kind: "Name", value: "isTentative" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AdminAllBookingsQuery, AdminAllBookingsQueryVariables>;
export const AllCabinsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AllCabins" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "cabins" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "maxGuests" } },
                { kind: "Field", name: { kind: "Name", value: "internalPrice" } },
                { kind: "Field", name: { kind: "Name", value: "externalPrice" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AllCabinsQuery, AllCabinsQueryVariables>;
export const ActiveBookingResponsibleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ActiveBookingResponsible" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "activeBookingResponsible" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "active" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
                { kind: "Field", name: { kind: "Name", value: "lastName" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ActiveBookingResponsibleQuery, ActiveBookingResponsibleQueryVariables>;
