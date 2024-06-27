/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query AboutUsOrganizationLayout($data: OrganizationInput!) {\n    organization(data: $data) {\n      organization {\n        id\n        name\n        description\n        logo {\n          id\n          url\n        }\n      }\n    }\n  }\n": types.AboutUsOrganizationLayoutDocument,
    "\n      query AboutUsOrganizationPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            name\n            description\n            logo {\n              id\n              url\n            }\n          }\n        }\n      }\n    ": types.AboutUsOrganizationPageDocument,
    "\n      query AboutUsOrganizationsPage {\n        organizations {\n          organizations {\n            id\n            name\n            logo {\n              id\n              url\n            }\n          }\n        }\n      }\n    ": types.AboutUsOrganizationsPageDocument,
    "\n  fragment BookNow_Query on Query {\n    cabins {\n      cabins {\n        id\n        name\n        internalPrice\n        externalPrice\n      }\n    }\n  }\n": types.BookNow_QueryFragmentDoc,
    "\n  fragment CabinsInfoSection_Query on Query {\n    ...BookNow_Query\n  }\n": types.CabinsInfoSection_QueryFragmentDoc,
    "\n  fragment ContactCabinBoard_Query on Query {\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n      }\n    }\n  }\n": types.ContactCabinBoard_QueryFragmentDoc,
    "\n  fragment Booking_Booking on Booking {\n    lastName\n    id\n    firstName\n    endDate\n    startDate\n    email\n    createdAt\n    cabins {\n      id\n      name\n    }\n    phoneNumber\n    status\n    totalCost\n    feedback\n    questions\n  }\n": types.Booking_BookingFragmentDoc,
    "\n  query CabinsAdminBookingsPage_Bookings($data: BookingsInput!) {\n    bookings(data: $data) {\n      bookings {\n        id\n        ...Booking_Booking\n      }\n      total\n    }\n  }\n": types.CabinsAdminBookingsPage_BookingsDocument,
    "\n      mutation CabinsAdminBookingsPage_UpdateBookingStatus($data: UpdateBookingStatusInput!) {\n        updateBookingStatus(data: $data) {\n          booking {\n            id\n            status\n            ...Booking_Booking\n          }\n        }\n      }\n    ": types.CabinsAdminBookingsPage_UpdateBookingStatusDocument,
    "\n      query CabinsAdminLayout_HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          hasFeaturePermission\n        }\n      }\n    ": types.CabinsAdminLayout_HasFeaturePermissionDocument,
    "\n  fragment AdminBookingContact_Query on Query {\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n        updatedAt\n      }\n    }\n  }\n": types.AdminBookingContact_QueryFragmentDoc,
    "\n      mutation BookingContact_UpdateBookingContact($data: UpdateBookingContactInput!) {\n        updateBookingContact(data: $data) {\n          bookingContact {\n            id\n            name\n            email\n            phoneNumber\n            updatedAt\n          }\n        }\n      }\n    ": types.BookingContact_UpdateBookingContactDocument,
    "\n  fragment BookingSemester_BookingSemester on BookingSemester {\n    id\n    startAt\n    endAt\n    bookingsEnabled\n    semester\n  }\n": types.BookingSemester_BookingSemesterFragmentDoc,
    "\n  fragment AdminBookingSemesters_Query on Query {\n    bookingSemesters {\n      spring {\n        ...BookingSemester_BookingSemester\n      }\n      fall {\n        ...BookingSemester_BookingSemester\n      }\n    }\n  }\n": types.AdminBookingSemesters_QueryFragmentDoc,
    "\n      mutation CabinsAdminSettingsPage_UpdateBookingSemesterMutation($data: UpdateBookingSemesterInput!) {\n        updateBookingSemester(data: $data) {\n          bookingSemester {\n            ...BookingSemester_BookingSemester\n          }\n        }\n      }\n    ": types.CabinsAdminSettingsPage_UpdateBookingSemesterMutationDocument,
    "\n  fragment AdminBookingTerms_Query on Query {\n    bookingTerms {\n      bookingTerms {\n        ...BookingTerms_BookingTerms\n      }\n    }\n  }\n": types.AdminBookingTerms_QueryFragmentDoc,
    "\n  fragment BookingTerms_BookingTerms on BookingTerms {\n    id\n    createdAt\n    file {\n      id\n      url\n    }\n  }\n": types.BookingTerms_BookingTermsFragmentDoc,
    "\n      mutation BookingTerms_UpdateBookingTerms {\n        updateBookingTerms {\n          bookingTerms {\n            ...BookingTerms_BookingTerms\n          }\n          uploadUrl\n        }\n      }\n    ": types.BookingTerms_UpdateBookingTermsDocument,
    "\n  fragment AdminCabins_Query on Query {\n    cabins {\n      cabins {\n        id\n        ...Cabins_Cabin\n      }\n    }\n  }\n": types.AdminCabins_QueryFragmentDoc,
    "\n  fragment Cabins_Cabin on Cabin {\n    id\n    name\n    price {\n      internal {\n        weekend\n        weekday\n      }\n      external {\n        weekend\n        weekday\n      }\n    }\n    capacity\n  }\n": types.Cabins_CabinFragmentDoc,
    "\n      mutation Cabins_CreateCabin($data: CreateCabinInput!) {\n        createCabin(data: $data) {\n          cabin {\n            ...Cabins_Cabin\n          }\n        }\n      }\n    ": types.Cabins_CreateCabinDocument,
    "\n      mutation Cabin_UpdateCabin($data: UpdateCabinInput!) {\n        updateCabin(data: $data) {\n          cabin {\n            ...Cabins_Cabin\n          }\n        }\n      }\n    ": types.Cabin_UpdateCabinDocument,
    "\n      query CabinsAdminSettingsPage_Query {\n        ...AdminCabins_Query\n        ...AdminBookingSemesters_Query\n        ...AdminBookingContact_Query\n        ...AdminBookingTerms_Query\n      }\n    ": types.CabinsAdminSettingsPage_QueryDocument,
    "\n  fragment BookingDetails_Cabin on Cabin {\n    id\n    capacity\n  }\n": types.BookingDetails_CabinFragmentDoc,
    "\n      query BookingDetails_TotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    ": types.BookingDetails_TotalCostDocument,
    "\n  fragment BookingTerms_Query on Query {\n    bookingTerms {\n      bookingTerms {\n        id\n        file {\n          id\n          url\n        }\n        createdAt\n      }\n    }\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n      }\n    }\n  }\n": types.BookingTerms_QueryFragmentDoc,
    "\n  fragment PickDates_Cabin on Cabin {\n    id\n    name\n  }\n": types.PickDates_CabinFragmentDoc,
    "\n  fragment PickDates_CalendarMonth on CalendarMonth {\n    month\n    year\n    days {\n      calendarDate\n      bookable\n      available\n      availableForCheckIn\n      availableForCheckOut\n      price\n    }\n  }\n": types.PickDates_CalendarMonthFragmentDoc,
    "\n  fragment Summary_Cabin on Cabin {\n    id\n    name\n  }\n": types.Summary_CabinFragmentDoc,
    "\n      query CabinsBookPage($calendarData: GetAvailabilityCalendarInput!) {\n        cabins {\n          cabins {\n            id\n            name\n            capacity\n            ...PickDates_Cabin\n            ...BookingDetails_Cabin\n            ...Summary_Cabin\n          }\n        }\n        getAvailabilityCalendar(data: $calendarData) {\n          calendarMonths {\n            ...PickDates_CalendarMonth\n          }\n        }\n        user {\n          user {\n            id\n            firstName\n            lastName\n            phoneNumber\n            email\n          }\n        }\n        ...BookingTerms_Query\n      }\n    ": types.CabinsBookPageDocument,
    "\n      query CabinsBookPage_GetAvailabilityCalendar($data: GetAvailabilityCalendarInput!) {\n        getAvailabilityCalendar(data: $data) {\n          calendarMonths {\n            ...PickDates_CalendarMonth\n          }\n        }\n      }\n    ": types.CabinsBookPage_GetAvailabilityCalendarDocument,
    "\n      query CabinsBookPageTotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    ": types.CabinsBookPageTotalCostDocument,
    "\n      mutation CabinsBookPageCreateBooking($data: NewBookingInput!) {\n        newBooking(data: $data) {\n          booking {\n            id\n            startDate\n            endDate\n            firstName\n            lastName\n            email\n            phoneNumber\n            cabins {\n              id\n              name\n            }\n            status\n          }\n        }\n      }\n    ": types.CabinsBookPageCreateBookingDocument,
    "\n      query BookingsPage_Bookings($data: BookingInput!) {\n        booking(data: $data) {\n          booking {\n            id\n            startDate\n            endDate\n            firstName\n            lastName\n            totalCost\n            email\n            status\n            feedback\n            phoneNumber\n            guests {\n              internal\n              external\n            }\n            cabins {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.BookingsPage_BookingsDocument,
    "\n      query CabinsPage {\n        ...CabinsInfoSection_Query\n        ...ContactCabinBoard_Query\n      }\n    ": types.CabinsPageDocument,
    "\n      query order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              id\n              name\n              description\n            }\n            paymentStatus\n            isFinalState\n            totalPrice {\n              valueInNok\n            }\n          }\n        }\n      }\n    ": types.OrderDocument,
    "\n      mutation initiatePaymentAttempt($data: InitiatePaymentAttemptInput!) {\n        initiatePaymentAttempt(data: $data) {\n          redirectUrl\n        }\n      }\n    ": types.InitiatePaymentAttemptDocument,
    "\n      mutation FileUpload_GetFileUploadUrl($data: UploadFileInput!) {\n        uploadFile(data: $data) {\n          sasUrl\n          file {\n            id\n          }\n        }\n      }\n    ": types.FileUpload_GetFileUploadUrlDocument,
    "\n      query AppLoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    ": types.AppLoginButtonUserDocument,
    "\n      query AppLoginRequiredUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    ": types.AppLoginRequiredUserDocument,
    "\n      query HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    ": types.HasFeaturePermissionDocument,
    "\n      query DocumentsLayout_HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    ": types.DocumentsLayout_HasFeaturePermissionDocument,
    "\n  query DocumentsPage_Documents {\n    documents {\n      documents {\n        id\n        ...DocumentFragment\n      }\n    }\n  }\n": types.DocumentsPage_DocumentsDocument,
    "\n      query DocumentsAdmin_Page {\n        documents {\n          documents {\n            id\n            name\n            file {\n              id\n              url\n              name\n            }\n            createdAt\n            updatedAt\n            description\n            categories {\n              id\n              name\n            }\n            ...DocumentListItemFragment\n          }\n        }\n      }\n    ": types.DocumentsAdmin_PageDocument,
    "\n      mutation DocumentsAdminPage_DeleteDocument($data: DeleteDocumentInput!) {\n        deleteDocument(data: $data) {\n          document {\n            id\n          }\n        }\n      }\n    ": types.DocumentsAdminPage_DeleteDocumentDocument,
    "\n  fragment DocumentListItemFragment on Document {\n    id\n    name\n    file {\n      id\n      url\n    }\n    updatedAt\n  }\n": types.DocumentListItemFragmentFragmentDoc,
    "\n      query EditDocumentsPage_Document($data: DocumentInput!) {\n        document(data: $data) {\n          document {\n            id\n            name\n            description\n            ...DocumentFragment\n            categories {\n              id\n              name\n            }\n          }\n        }\n        documentCategories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    ": types.EditDocumentsPage_DocumentDocument,
    "\n      mutation EditDocumentsPage_UpdateDocument($data: UpdateDocumentInput!) {\n        updateDocument(data: $data) {\n          document {\n            id\n            name\n          }\n        }\n      }\n    ": types.EditDocumentsPage_UpdateDocumentDocument,
    "\n      query DocumentsNew_Layout {\n        hasFeaturePermission(data: { featurePermission: ARCHIVE_WRITE_DOCUMENTS }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    ": types.DocumentsNew_LayoutDocument,
    "\n      query NewDocumentsPage_DocumentCategories {\n        documentCategories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    ": types.NewDocumentsPage_DocumentCategoriesDocument,
    "\n      mutation NewDocumentPage_CreateDocument($data: CreateDocumentInput!) {\n        createDocument(data: $data) {\n          document {\n            ...DocumentFragment\n          }\n          uploadUrl\n        }\n      }\n    ": types.NewDocumentPage_CreateDocumentDocument,
    "\n  fragment DocumentFragment on Document {\n    file {\n      id\n      url\n    }\n    name\n    description\n    categories {\n      id\n      name\n    }\n  }\n": types.DocumentFragmentFragmentDoc,
    "\n      mutation DropzoneUploadFile($data: UploadFileInput!) {\n        uploadFile(data: $data) {\n          sasUrl\n        }\n      }\n    ": types.DropzoneUploadFileDocument,
    "\n  fragment EventListItem_Event on Event {\n    id\n    name\n    description\n    startAt\n    signUpAvailability\n    shortDescription\n    signUpDetails {\n      signUpsStartAt\n    }\n    organization {\n      id\n      colorScheme\n    }\n  }\n": types.EventListItem_EventFragmentDoc,
    "\n      query EventsPage($data: EventsInput!) {\n        events(data: $data) {\n          nextWeek {\n            id\n            ...EventListItem_Event\n          }\n          thisWeek {\n            id\n            ...EventListItem_Event\n          }\n          twoWeeksOrLater {\n            id\n            ...EventListItem_Event\n          }\n        }\n        ...FilterMenu_Query\n      }\n    ": types.EventsPageDocument,
    "\n  fragment CategoryFilter_Query on Query {\n    categories {\n      categories {\n        id\n        name\n      }\n    }\n  }\n": types.CategoryFilter_QueryFragmentDoc,
    "\n  fragment OrganizationFilter_Query on Query {\n    organizationEvents: events(data: { futureEventsOnly: true }) {\n      events {\n        id\n        organization {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.OrganizationFilter_QueryFragmentDoc,
    "\n  fragment FilterMenu_Query on Query {\n    ...OrganizationFilter_Query\n    ...CategoryFilter_Query\n  }\n": types.FilterMenu_QueryFragmentDoc,
    "\n  fragment Action_EventFragment on Event {\n    id\n    signUpDetails {\n      signUpsStartAt\n      signUpsEndAt\n    }\n    signUpAvailability\n    signUpsRetractable\n    signUpsRequireUserProvidedInformation\n    signUp {\n      id\n      participationStatus\n      approximatePositionOnWaitList\n    }\n  }\n": types.Action_EventFragmentFragmentDoc,
    "\n      mutation EventSignUp($data: SignUpInput!) {\n        signUp(data: $data) {\n          signUp {\n            id\n            participationStatus\n            event {\n              user {\n                ticket {\n                  id\n                  paymentStatus\n                }\n              }\n              id\n              signUpAvailability\n            }\n          }\n        }\n      }\n    ": types.EventSignUpDocument,
    "\n      mutation EventRetractSignUp($data: RetractSignUpInput!) {\n        retractSignUp(data: $data) {\n          signUp {\n            id\n            participationStatus\n            event {\n              id\n              signUpAvailability\n            }\n          }\n        }\n      }\n    ": types.EventRetractSignUpDocument,
    "\n      query UseCountdownServerTime {\n        serverTime {\n          serverTime\n        }\n      }\n    ": types.UseCountdownServerTimeDocument,
    "\n  fragment EventSignUp_EventFragment on Event {\n    signUpAvailability\n    id\n    user {\n      id\n      signUp {\n        id\n        participationStatus\n        approximatePositionOnWaitList\n      }\n      ticket {\n        id\n        paymentStatus\n      }\n    }\n    ticketInformation {\n      product {\n        id\n        price {\n          valueInNok\n        }\n      }\n    }\n    ...Action_EventFragment\n  }\n": types.EventSignUp_EventFragmentFragmentDoc,
    "\n  fragment EventLayout_Event on Event {\n    id\n    name\n    shortDescription\n    organization {\n      id\n      name\n    }\n  }\n": types.EventLayout_EventFragmentDoc,
    "\n      query EventLayout_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            ...EventLayout_Event\n          }\n        }\n      }\n    ": types.EventLayout_EventQueryDocument,
    "\n  query EventPage_EventQuery($data: EventInput!) {\n    event(data: $data) {\n      event {\n        id\n        name\n        description\n        signUpsEnabled\n        location\n        signUpsRetractable\n        endAt\n        startAt\n        contactEmail\n        ticketInformation {\n          product {\n            id\n            price {\n              valueInNok\n            }\n          }\n        }\n        categories {\n          id\n          name\n        }\n        ...EventSignUp_EventFragment\n      }\n    }\n  }\n": types.EventPage_EventQueryDocument,
    "\n  fragment SelectMerchant_Merchant on Merchant {\n    id\n    name\n  }\n": types.SelectMerchant_MerchantFragmentDoc,
    "\n  fragment TicketEventForm_Merchant on Merchant {\n    id\n    name\n    ...SelectMerchant_Merchant\n  }\n": types.TicketEventForm_MerchantFragmentDoc,
    "\n      query CreateBasicEventPage_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    ": types.CreateBasicEventPage_QueryDocument,
    "\n      mutation CreateBasicEventPage_CreateEvent($data: CreateEventInput!) {\n        createEvent(data: $data) {\n          event {\n            id\n            organization {\n              id\n            }\n          }\n        }\n      }\n    ": types.CreateBasicEventPage_CreateEventDocument,
    "\n      mutation CreateSignUpEventPage_CreateEvent($data: CreateEventInput!) {\n        createEvent(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n            }\n          }\n        }\n      }\n    ": types.CreateSignUpEventPage_CreateEventDocument,
    "\n      query CreateSignUpEventPage_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    ": types.CreateSignUpEventPage_QueryDocument,
    "\n      mutation CreateTicketEventPage_CreateEvent($data: CreateEventInput!) {\n        createEvent(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n            }\n          }\n        }\n      }\n    ": types.CreateTicketEventPage_CreateEventDocument,
    "\n      query CreateTicketEventPage_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n\n        merchants {\n          merchants {\n            ...TicketEventForm_Merchant\n            id\n            name\n          }\n        }\n      }\n    ": types.CreateTicketEventPage_QueryDocument,
    "\n  fragment ListingItem_Listing on Listing {\n    id\n    name\n    closesAt\n    organization {\n      id\n      name\n      logo {\n        id\n        url\n      }\n    }\n  }\n": types.ListingItem_ListingFragmentDoc,
    "\n  fragment Listings_Query on Query {\n    listings {\n      listings {\n        id\n        ...ListingItem_Listing\n      }\n    }\n  }\n": types.Listings_QueryFragmentDoc,
    "\n      query ListingsPage_Query {\n        ...Listings_Query\n      }\n    ": types.ListingsPage_QueryDocument,
    "\n  query ListingPage_Query($data: ListingInput!) {\n    listing(data: $data) {\n      listing {\n        id\n        description\n        ...TitleCard_Listing\n      }\n    }\n  }\n": types.ListingPage_QueryDocument,
    "\n  fragment TitleCard_Listing on Listing {\n    name\n    applicationUrl\n    closesAt\n    organization {\n      id\n      name\n    }\n  }\n": types.TitleCard_ListingFragmentDoc,
    "\n      query ListingLayout_Query($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.ListingLayout_QueryDocument,
    "\n      query ListingMetadata($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            description\n          }\n        }\n      }\n    ": types.ListingMetadataDocument,
    "\n      query NewListing_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.NewListing_QueryDocument,
    "\n      mutation NewListing_CreateListingMutation($data: CreateListingInput!) {\n        createListing(data: $data) {\n          listing {\n            id\n            name\n            description\n            closesAt\n            organization {\n              id\n              name\n            }\n            applicationUrl\n          }\n        }\n      }\n    ": types.NewListing_CreateListingMutationDocument,
    "\n      query LoginPage_UserQuery {\n        user {\n          user {\n            id\n          }\n        }\n      }\n    ": types.LoginPage_UserQueryDocument,
    "\n      query OrganizationsAdminEventsAboutPage_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            startAt\n            endAt\n            type\n            location\n            contactEmail\n            ticketInformation {\n              product {\n                id\n                price {\n                  valueInNok\n                }\n              }\n            }\n            organization {\n              id\n              name\n            }\n            signUps {\n              confirmed {\n                total\n              }\n              waitList {\n                total\n              }\n            }\n          }\n        }\n      }\n    ": types.OrganizationsAdminEventsAboutPage_EventQueryDocument,
    "\n      query EventAdminLayout_Event($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    ": types.EventAdminLayout_EventDocument,
    "\n  fragment OrganizationsAdminEventsSignUpsPage_SignUp on SignUp {\n    id\n    createdAt\n    userProvidedInformation\n    order {\n      id\n      paymentStatus\n    }\n    user {\n      id\n      firstName\n      lastName\n      gradeYear\n      username\n    }\n  }\n": types.OrganizationsAdminEventsSignUpsPage_SignUpFragmentDoc,
    "\n  query OrganizationsAdminEventsSignUpsPage_EventQuery($data: EventInput!) {\n    event(data: $data) {\n      event {\n        id\n        type\n        signUpsRequireUserProvidedInformation\n        signUps {\n          confirmed {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n          waitList {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n          retracted {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n          removed {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n        }\n      }\n    }\n  }\n": types.OrganizationsAdminEventsSignUpsPage_EventQueryDocument,
    "\n      mutation OrganizationsAdminEventsSignUpsPage_RemoveSignUp($data: RemoveSignUpInput!) {\n        removeSignUp(data: $data) {\n          signUp {\n            id\n            participationStatus\n            user {\n              id\n              firstName\n              lastName\n            }\n            event {\n              id\n            }\n          }\n        }\n      }\n    ": types.OrganizationsAdminEventsSignUpsPage_RemoveSignUpDocument,
    "\n      query AdminOrganizationsEventsPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            events {\n              type\n              signUps {\n                confirmed {\n                  total\n                }\n              }\n              id\n              name\n              startAt\n              signUpDetails {\n                capacity\n              }\n            }\n          }\n        }\n      }\n    ": types.AdminOrganizationsEventsPageDocument,
    "\n      query OrganizationPageLayout($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n            colorScheme\n            logo {\n              id\n              url\n            }\n          }\n        }\n      }\n    ": types.OrganizationPageLayoutDocument,
    "\n      query AdminOrganizationsPageListings($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            listings {\n              id\n              name\n              closesAt\n            }\n          }\n        }\n      }\n    ": types.AdminOrganizationsPageListingsDocument,
    "\n  fragment AddMemberDialog_Member on Member {\n    id\n    user {\n      id\n      firstName\n      lastName\n    }\n    organization {\n      id\n    }\n    role\n  }\n": types.AddMemberDialog_MemberFragmentDoc,
    "\n      mutation OrganizationsAdminMembersPage_AddMember($data: AddMemberInput!) {\n        addMember(data: $data) {\n          ... on AddMemberSuccessResponse {\n            member {\n              ...AddMemberDialog_Member\n            }\n          }\n          ... on AddMemberErrorResponse {\n            code\n            message\n          }\n        }\n      }\n    ": types.OrganizationsAdminMembersPage_AddMemberDocument,
    "\n      query AdminOrganizationsPageMembers($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            members {\n              id\n              user {\n                id\n                firstName\n                lastName\n              }\n              role\n            }\n          }\n        }\n        user {\n          user {\n            id\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: ADMIN }) {\n          hasRole\n        }\n      }\n    ": types.AdminOrganizationsPageMembersDocument,
    "\n      mutation OrganizationsAdminMembersPage_UpdateRole($data: UpdateRoleInput!) {\n        updateRole(data: $data) {\n          member {\n            id\n            role\n            user {\n              id\n              firstName\n              lastName\n            }\n          }\n        }\n      }\n    ": types.OrganizationsAdminMembersPage_UpdateRoleDocument,
    "\n      mutation OrganizationsAdminMembersPage_RemoveMember($data: RemoveMemberInput!) {\n        removeMember(data: $data) {\n          member {\n            id\n            user {\n              id\n              firstName\n              lastName\n            }\n          }\n        }\n      }\n    ": types.OrganizationsAdminMembersPage_RemoveMemberDocument,
    "\n  fragment OrganizationsAdminEditPage_OrganizationFragment on Organization {\n    id\n    colorScheme\n    logo {\n      url\n      id\n    }\n    name\n    description\n    featurePermissions\n  }\n": types.OrganizationsAdminEditPage_OrganizationFragmentFragmentDoc,
    "\n      query OrganizationsAdminEditPage_IsSuperUser($data: OrganizationInput!) {\n        user {\n          user {\n            id\n            isSuperUser\n          }\n        }\n        organization(data: $data) {\n          organization {\n            ...OrganizationsAdminEditPage_OrganizationFragment\n          }\n        }\n      }\n    ": types.OrganizationsAdminEditPage_IsSuperUserDocument,
    "\n      mutation OrganizationsAdminEditPage($data: UpdateOrganizationInput!) {\n        updateOrganization(data: $data) {\n          organization {\n            ...OrganizationsAdminEditPage_OrganizationFragment\n          }\n        }\n      }\n    ": types.OrganizationsAdminEditPageDocument,
    "\n      mutation OrganizationsAdminEditPageUploadFile($data: UploadFileInput!) {\n        uploadFile(data: $data) {\n          sasUrl\n          file {\n            id\n          }\n        }\n      }\n    ": types.OrganizationsAdminEditPageUploadFileDocument,
    "\n      query OrganizationLayout_Organization($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    ": types.OrganizationLayout_OrganizationDocument,
    "\n      query OrganizationAdminLayout_HasRole($organizationId: ID!) {\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    ": types.OrganizationAdminLayout_HasRoleDocument,
    "\n  fragment CabinsAdminCard_Query on Query {\n    bookings(data: { status: PENDING }) {\n      total\n      bookings {\n        id\n        status\n      }\n    }\n  }\n": types.CabinsAdminCard_QueryFragmentDoc,
    "\n      query AppProfileUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            gradeYear\n            isSuperUser\n            studyProgram {\n              id\n              name\n            }\n          }\n        }\n\n        ...CabinsAdminCard_Query\n      }\n    ": types.AppProfileUserDocument,
    "\n      query AppProfileCabinPermission {\n        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    ": types.AppProfileCabinPermissionDocument,
    "\n      query AppProfileDocumentsPermission {\n        hasFeaturePermission(data: { featurePermission: ARCHIVE_WRITE_DOCUMENTS }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    ": types.AppProfileDocumentsPermissionDocument,
    "\n  fragment UserForm_User on PrivateUser {\n    firstName\n    lastName\n    phoneNumber\n    graduationYear\n    allergies\n    graduationYearUpdatedAt\n    canUpdateYear\n    gradeYear\n    email\n    studyProgram {\n      id\n      name\n    }\n  }\n": types.UserForm_UserFragmentDoc,
    "\n  query ProfileEditPage_User {\n    user {\n      user {\n        id\n        ...UserForm_User\n      }\n    }\n  }\n": types.ProfileEditPage_UserDocument,
    "\n      mutation ProfileEditPage_UpdateUser($data: UpdateUserInput!) {\n        updateUser(data: $data) {\n          user {\n            id\n            ...UserForm_User\n          }\n        }\n      }\n    ": types.ProfileEditPage_UpdateUserDocument,
    "\n  fragment OrderStatus_SignUp on SignUp {\n    order {\n      id\n      paymentStatus\n      totalPrice {\n        valueInNok\n      }\n    }\n  }\n": types.OrderStatus_SignUpFragmentDoc,
    "\n  fragment ParticipationStatus_SignUp on SignUp {\n    participationStatus\n    approximatePositionOnWaitList\n  }\n": types.ParticipationStatus_SignUpFragmentDoc,
    "\n      query ProfileEventsPage($data: UserSignUpsInput) {\n        user {\n          user {\n            id\n            all: signUps(data: { participationStatus: null }) {\n              total\n            }\n            confirmed: signUps(data: { participationStatus: CONFIRMED }) {\n              total\n            }\n            onWaitlist: signUps(data: { participationStatus: ON_WAITLIST }) {\n              total\n            }\n            retracted: signUps(data: { participationStatus: RETRACTED }) {\n              total\n            }\n            removed: signUps(data: { participationStatus: REMOVED }) {\n              total\n            }\n            signUps(data: $data) {\n              signUps {\n                id\n                createdAt\n                event {\n                  id\n                  name\n                  startAt\n                  type\n                }\n                ...OrderStatus_SignUp\n                ...ParticipationStatus_SignUp\n              }\n            }\n          }\n        }\n      }\n    ": types.ProfileEventsPageDocument,
    "\n      query ProfileLayout_UserQuery {\n        user {\n          user {\n            id\n          }\n        }\n      }\n    ": types.ProfileLayout_UserQueryDocument,
    "\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    ": types.ProfileOrdersPageDocument,
    "\n      query UserOrganizationsPage {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n              logo {\n                id\n                url\n              }\n            }\n          }\n        }\n      }\n    ": types.UserOrganizationsPageDocument,
    "\n      query ReceiptLayout_Order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              name\n            }\n          }\n        }\n      }\n    ": types.ReceiptLayout_OrderDocument,
    "\n  query ReceiptPage_Order($data: OrderInput!, $reference: String) {\n    order(data: $data) {\n      order {\n        id\n        isFinalState\n        purchasedAt\n        product {\n          id\n          name\n          description\n        }\n        paymentAttempt(reference: $reference) {\n          id\n          state\n          reference\n          isFinalState\n        }\n        capturedPaymentAttempt {\n          id\n          state\n          reference\n        }\n        paymentStatus\n        totalPrice {\n          value\n          unit\n          valueInNok\n        }\n      }\n    }\n  }\n": types.ReceiptPage_OrderDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AboutUsOrganizationLayout($data: OrganizationInput!) {\n    organization(data: $data) {\n      organization {\n        id\n        name\n        description\n        logo {\n          id\n          url\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AboutUsOrganizationLayout($data: OrganizationInput!) {\n    organization(data: $data) {\n      organization {\n        id\n        name\n        description\n        logo {\n          id\n          url\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AboutUsOrganizationPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            name\n            description\n            logo {\n              id\n              url\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AboutUsOrganizationPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            name\n            description\n            logo {\n              id\n              url\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AboutUsOrganizationsPage {\n        organizations {\n          organizations {\n            id\n            name\n            logo {\n              id\n              url\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AboutUsOrganizationsPage {\n        organizations {\n          organizations {\n            id\n            name\n            logo {\n              id\n              url\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BookNow_Query on Query {\n    cabins {\n      cabins {\n        id\n        name\n        internalPrice\n        externalPrice\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BookNow_Query on Query {\n    cabins {\n      cabins {\n        id\n        name\n        internalPrice\n        externalPrice\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CabinsInfoSection_Query on Query {\n    ...BookNow_Query\n  }\n"): (typeof documents)["\n  fragment CabinsInfoSection_Query on Query {\n    ...BookNow_Query\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ContactCabinBoard_Query on Query {\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ContactCabinBoard_Query on Query {\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Booking_Booking on Booking {\n    lastName\n    id\n    firstName\n    endDate\n    startDate\n    email\n    createdAt\n    cabins {\n      id\n      name\n    }\n    phoneNumber\n    status\n    totalCost\n    feedback\n    questions\n  }\n"): (typeof documents)["\n  fragment Booking_Booking on Booking {\n    lastName\n    id\n    firstName\n    endDate\n    startDate\n    email\n    createdAt\n    cabins {\n      id\n      name\n    }\n    phoneNumber\n    status\n    totalCost\n    feedback\n    questions\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CabinsAdminBookingsPage_Bookings($data: BookingsInput!) {\n    bookings(data: $data) {\n      bookings {\n        id\n        ...Booking_Booking\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query CabinsAdminBookingsPage_Bookings($data: BookingsInput!) {\n    bookings(data: $data) {\n      bookings {\n        id\n        ...Booking_Booking\n      }\n      total\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CabinsAdminBookingsPage_UpdateBookingStatus($data: UpdateBookingStatusInput!) {\n        updateBookingStatus(data: $data) {\n          booking {\n            id\n            status\n            ...Booking_Booking\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation CabinsAdminBookingsPage_UpdateBookingStatus($data: UpdateBookingStatusInput!) {\n        updateBookingStatus(data: $data) {\n          booking {\n            id\n            status\n            ...Booking_Booking\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CabinsAdminLayout_HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          hasFeaturePermission\n        }\n      }\n    "): (typeof documents)["\n      query CabinsAdminLayout_HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          hasFeaturePermission\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AdminBookingContact_Query on Query {\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment AdminBookingContact_Query on Query {\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation BookingContact_UpdateBookingContact($data: UpdateBookingContactInput!) {\n        updateBookingContact(data: $data) {\n          bookingContact {\n            id\n            name\n            email\n            phoneNumber\n            updatedAt\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation BookingContact_UpdateBookingContact($data: UpdateBookingContactInput!) {\n        updateBookingContact(data: $data) {\n          bookingContact {\n            id\n            name\n            email\n            phoneNumber\n            updatedAt\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BookingSemester_BookingSemester on BookingSemester {\n    id\n    startAt\n    endAt\n    bookingsEnabled\n    semester\n  }\n"): (typeof documents)["\n  fragment BookingSemester_BookingSemester on BookingSemester {\n    id\n    startAt\n    endAt\n    bookingsEnabled\n    semester\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AdminBookingSemesters_Query on Query {\n    bookingSemesters {\n      spring {\n        ...BookingSemester_BookingSemester\n      }\n      fall {\n        ...BookingSemester_BookingSemester\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment AdminBookingSemesters_Query on Query {\n    bookingSemesters {\n      spring {\n        ...BookingSemester_BookingSemester\n      }\n      fall {\n        ...BookingSemester_BookingSemester\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CabinsAdminSettingsPage_UpdateBookingSemesterMutation($data: UpdateBookingSemesterInput!) {\n        updateBookingSemester(data: $data) {\n          bookingSemester {\n            ...BookingSemester_BookingSemester\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation CabinsAdminSettingsPage_UpdateBookingSemesterMutation($data: UpdateBookingSemesterInput!) {\n        updateBookingSemester(data: $data) {\n          bookingSemester {\n            ...BookingSemester_BookingSemester\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AdminBookingTerms_Query on Query {\n    bookingTerms {\n      bookingTerms {\n        ...BookingTerms_BookingTerms\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment AdminBookingTerms_Query on Query {\n    bookingTerms {\n      bookingTerms {\n        ...BookingTerms_BookingTerms\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BookingTerms_BookingTerms on BookingTerms {\n    id\n    createdAt\n    file {\n      id\n      url\n    }\n  }\n"): (typeof documents)["\n  fragment BookingTerms_BookingTerms on BookingTerms {\n    id\n    createdAt\n    file {\n      id\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation BookingTerms_UpdateBookingTerms {\n        updateBookingTerms {\n          bookingTerms {\n            ...BookingTerms_BookingTerms\n          }\n          uploadUrl\n        }\n      }\n    "): (typeof documents)["\n      mutation BookingTerms_UpdateBookingTerms {\n        updateBookingTerms {\n          bookingTerms {\n            ...BookingTerms_BookingTerms\n          }\n          uploadUrl\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AdminCabins_Query on Query {\n    cabins {\n      cabins {\n        id\n        ...Cabins_Cabin\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment AdminCabins_Query on Query {\n    cabins {\n      cabins {\n        id\n        ...Cabins_Cabin\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Cabins_Cabin on Cabin {\n    id\n    name\n    price {\n      internal {\n        weekend\n        weekday\n      }\n      external {\n        weekend\n        weekday\n      }\n    }\n    capacity\n  }\n"): (typeof documents)["\n  fragment Cabins_Cabin on Cabin {\n    id\n    name\n    price {\n      internal {\n        weekend\n        weekday\n      }\n      external {\n        weekend\n        weekday\n      }\n    }\n    capacity\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation Cabins_CreateCabin($data: CreateCabinInput!) {\n        createCabin(data: $data) {\n          cabin {\n            ...Cabins_Cabin\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation Cabins_CreateCabin($data: CreateCabinInput!) {\n        createCabin(data: $data) {\n          cabin {\n            ...Cabins_Cabin\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation Cabin_UpdateCabin($data: UpdateCabinInput!) {\n        updateCabin(data: $data) {\n          cabin {\n            ...Cabins_Cabin\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation Cabin_UpdateCabin($data: UpdateCabinInput!) {\n        updateCabin(data: $data) {\n          cabin {\n            ...Cabins_Cabin\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CabinsAdminSettingsPage_Query {\n        ...AdminCabins_Query\n        ...AdminBookingSemesters_Query\n        ...AdminBookingContact_Query\n        ...AdminBookingTerms_Query\n      }\n    "): (typeof documents)["\n      query CabinsAdminSettingsPage_Query {\n        ...AdminCabins_Query\n        ...AdminBookingSemesters_Query\n        ...AdminBookingContact_Query\n        ...AdminBookingTerms_Query\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BookingDetails_Cabin on Cabin {\n    id\n    capacity\n  }\n"): (typeof documents)["\n  fragment BookingDetails_Cabin on Cabin {\n    id\n    capacity\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query BookingDetails_TotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    "): (typeof documents)["\n      query BookingDetails_TotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BookingTerms_Query on Query {\n    bookingTerms {\n      bookingTerms {\n        id\n        file {\n          id\n          url\n        }\n        createdAt\n      }\n    }\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BookingTerms_Query on Query {\n    bookingTerms {\n      bookingTerms {\n        id\n        file {\n          id\n          url\n        }\n        createdAt\n      }\n    }\n    bookingContact {\n      bookingContact {\n        id\n        name\n        email\n        phoneNumber\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PickDates_Cabin on Cabin {\n    id\n    name\n  }\n"): (typeof documents)["\n  fragment PickDates_Cabin on Cabin {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PickDates_CalendarMonth on CalendarMonth {\n    month\n    year\n    days {\n      calendarDate\n      bookable\n      available\n      availableForCheckIn\n      availableForCheckOut\n      price\n    }\n  }\n"): (typeof documents)["\n  fragment PickDates_CalendarMonth on CalendarMonth {\n    month\n    year\n    days {\n      calendarDate\n      bookable\n      available\n      availableForCheckIn\n      availableForCheckOut\n      price\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Summary_Cabin on Cabin {\n    id\n    name\n  }\n"): (typeof documents)["\n  fragment Summary_Cabin on Cabin {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CabinsBookPage($calendarData: GetAvailabilityCalendarInput!) {\n        cabins {\n          cabins {\n            id\n            name\n            capacity\n            ...PickDates_Cabin\n            ...BookingDetails_Cabin\n            ...Summary_Cabin\n          }\n        }\n        getAvailabilityCalendar(data: $calendarData) {\n          calendarMonths {\n            ...PickDates_CalendarMonth\n          }\n        }\n        user {\n          user {\n            id\n            firstName\n            lastName\n            phoneNumber\n            email\n          }\n        }\n        ...BookingTerms_Query\n      }\n    "): (typeof documents)["\n      query CabinsBookPage($calendarData: GetAvailabilityCalendarInput!) {\n        cabins {\n          cabins {\n            id\n            name\n            capacity\n            ...PickDates_Cabin\n            ...BookingDetails_Cabin\n            ...Summary_Cabin\n          }\n        }\n        getAvailabilityCalendar(data: $calendarData) {\n          calendarMonths {\n            ...PickDates_CalendarMonth\n          }\n        }\n        user {\n          user {\n            id\n            firstName\n            lastName\n            phoneNumber\n            email\n          }\n        }\n        ...BookingTerms_Query\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CabinsBookPage_GetAvailabilityCalendar($data: GetAvailabilityCalendarInput!) {\n        getAvailabilityCalendar(data: $data) {\n          calendarMonths {\n            ...PickDates_CalendarMonth\n          }\n        }\n      }\n    "): (typeof documents)["\n      query CabinsBookPage_GetAvailabilityCalendar($data: GetAvailabilityCalendarInput!) {\n        getAvailabilityCalendar(data: $data) {\n          calendarMonths {\n            ...PickDates_CalendarMonth\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CabinsBookPageTotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    "): (typeof documents)["\n      query CabinsBookPageTotalCost($data: TotalCostInput!) {\n        totalCost(data: $data) {\n          totalCost\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CabinsBookPageCreateBooking($data: NewBookingInput!) {\n        newBooking(data: $data) {\n          booking {\n            id\n            startDate\n            endDate\n            firstName\n            lastName\n            email\n            phoneNumber\n            cabins {\n              id\n              name\n            }\n            status\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation CabinsBookPageCreateBooking($data: NewBookingInput!) {\n        newBooking(data: $data) {\n          booking {\n            id\n            startDate\n            endDate\n            firstName\n            lastName\n            email\n            phoneNumber\n            cabins {\n              id\n              name\n            }\n            status\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query BookingsPage_Bookings($data: BookingInput!) {\n        booking(data: $data) {\n          booking {\n            id\n            startDate\n            endDate\n            firstName\n            lastName\n            totalCost\n            email\n            status\n            feedback\n            phoneNumber\n            guests {\n              internal\n              external\n            }\n            cabins {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query BookingsPage_Bookings($data: BookingInput!) {\n        booking(data: $data) {\n          booking {\n            id\n            startDate\n            endDate\n            firstName\n            lastName\n            totalCost\n            email\n            status\n            feedback\n            phoneNumber\n            guests {\n              internal\n              external\n            }\n            cabins {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CabinsPage {\n        ...CabinsInfoSection_Query\n        ...ContactCabinBoard_Query\n      }\n    "): (typeof documents)["\n      query CabinsPage {\n        ...CabinsInfoSection_Query\n        ...ContactCabinBoard_Query\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              id\n              name\n              description\n            }\n            paymentStatus\n            isFinalState\n            totalPrice {\n              valueInNok\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              id\n              name\n              description\n            }\n            paymentStatus\n            isFinalState\n            totalPrice {\n              valueInNok\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation initiatePaymentAttempt($data: InitiatePaymentAttemptInput!) {\n        initiatePaymentAttempt(data: $data) {\n          redirectUrl\n        }\n      }\n    "): (typeof documents)["\n      mutation initiatePaymentAttempt($data: InitiatePaymentAttemptInput!) {\n        initiatePaymentAttempt(data: $data) {\n          redirectUrl\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation FileUpload_GetFileUploadUrl($data: UploadFileInput!) {\n        uploadFile(data: $data) {\n          sasUrl\n          file {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation FileUpload_GetFileUploadUrl($data: UploadFileInput!) {\n        uploadFile(data: $data) {\n          sasUrl\n          file {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppLoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AppLoginButtonUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppLoginRequiredUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AppLoginRequiredUser {\n        user {\n          user {\n            id\n            firstName\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "): (typeof documents)["\n      query HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query DocumentsLayout_HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "): (typeof documents)["\n      query DocumentsLayout_HasFeaturePermission($data: HasFeaturePermissionInput!) {\n        hasFeaturePermission(data: $data) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DocumentsPage_Documents {\n    documents {\n      documents {\n        id\n        ...DocumentFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query DocumentsPage_Documents {\n    documents {\n      documents {\n        id\n        ...DocumentFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query DocumentsAdmin_Page {\n        documents {\n          documents {\n            id\n            name\n            file {\n              id\n              url\n              name\n            }\n            createdAt\n            updatedAt\n            description\n            categories {\n              id\n              name\n            }\n            ...DocumentListItemFragment\n          }\n        }\n      }\n    "): (typeof documents)["\n      query DocumentsAdmin_Page {\n        documents {\n          documents {\n            id\n            name\n            file {\n              id\n              url\n              name\n            }\n            createdAt\n            updatedAt\n            description\n            categories {\n              id\n              name\n            }\n            ...DocumentListItemFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation DocumentsAdminPage_DeleteDocument($data: DeleteDocumentInput!) {\n        deleteDocument(data: $data) {\n          document {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation DocumentsAdminPage_DeleteDocument($data: DeleteDocumentInput!) {\n        deleteDocument(data: $data) {\n          document {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DocumentListItemFragment on Document {\n    id\n    name\n    file {\n      id\n      url\n    }\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment DocumentListItemFragment on Document {\n    id\n    name\n    file {\n      id\n      url\n    }\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query EditDocumentsPage_Document($data: DocumentInput!) {\n        document(data: $data) {\n          document {\n            id\n            name\n            description\n            ...DocumentFragment\n            categories {\n              id\n              name\n            }\n          }\n        }\n        documentCategories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query EditDocumentsPage_Document($data: DocumentInput!) {\n        document(data: $data) {\n          document {\n            id\n            name\n            description\n            ...DocumentFragment\n            categories {\n              id\n              name\n            }\n          }\n        }\n        documentCategories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation EditDocumentsPage_UpdateDocument($data: UpdateDocumentInput!) {\n        updateDocument(data: $data) {\n          document {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation EditDocumentsPage_UpdateDocument($data: UpdateDocumentInput!) {\n        updateDocument(data: $data) {\n          document {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query DocumentsNew_Layout {\n        hasFeaturePermission(data: { featurePermission: ARCHIVE_WRITE_DOCUMENTS }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "): (typeof documents)["\n      query DocumentsNew_Layout {\n        hasFeaturePermission(data: { featurePermission: ARCHIVE_WRITE_DOCUMENTS }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query NewDocumentsPage_DocumentCategories {\n        documentCategories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query NewDocumentsPage_DocumentCategories {\n        documentCategories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation NewDocumentPage_CreateDocument($data: CreateDocumentInput!) {\n        createDocument(data: $data) {\n          document {\n            ...DocumentFragment\n          }\n          uploadUrl\n        }\n      }\n    "): (typeof documents)["\n      mutation NewDocumentPage_CreateDocument($data: CreateDocumentInput!) {\n        createDocument(data: $data) {\n          document {\n            ...DocumentFragment\n          }\n          uploadUrl\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DocumentFragment on Document {\n    file {\n      id\n      url\n    }\n    name\n    description\n    categories {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment DocumentFragment on Document {\n    file {\n      id\n      url\n    }\n    name\n    description\n    categories {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation DropzoneUploadFile($data: UploadFileInput!) {\n        uploadFile(data: $data) {\n          sasUrl\n        }\n      }\n    "): (typeof documents)["\n      mutation DropzoneUploadFile($data: UploadFileInput!) {\n        uploadFile(data: $data) {\n          sasUrl\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventListItem_Event on Event {\n    id\n    name\n    description\n    startAt\n    signUpAvailability\n    shortDescription\n    signUpDetails {\n      signUpsStartAt\n    }\n    organization {\n      id\n      colorScheme\n    }\n  }\n"): (typeof documents)["\n  fragment EventListItem_Event on Event {\n    id\n    name\n    description\n    startAt\n    signUpAvailability\n    shortDescription\n    signUpDetails {\n      signUpsStartAt\n    }\n    organization {\n      id\n      colorScheme\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query EventsPage($data: EventsInput!) {\n        events(data: $data) {\n          nextWeek {\n            id\n            ...EventListItem_Event\n          }\n          thisWeek {\n            id\n            ...EventListItem_Event\n          }\n          twoWeeksOrLater {\n            id\n            ...EventListItem_Event\n          }\n        }\n        ...FilterMenu_Query\n      }\n    "): (typeof documents)["\n      query EventsPage($data: EventsInput!) {\n        events(data: $data) {\n          nextWeek {\n            id\n            ...EventListItem_Event\n          }\n          thisWeek {\n            id\n            ...EventListItem_Event\n          }\n          twoWeeksOrLater {\n            id\n            ...EventListItem_Event\n          }\n        }\n        ...FilterMenu_Query\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryFilter_Query on Query {\n    categories {\n      categories {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment CategoryFilter_Query on Query {\n    categories {\n      categories {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrganizationFilter_Query on Query {\n    organizationEvents: events(data: { futureEventsOnly: true }) {\n      events {\n        id\n        organization {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment OrganizationFilter_Query on Query {\n    organizationEvents: events(data: { futureEventsOnly: true }) {\n      events {\n        id\n        organization {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FilterMenu_Query on Query {\n    ...OrganizationFilter_Query\n    ...CategoryFilter_Query\n  }\n"): (typeof documents)["\n  fragment FilterMenu_Query on Query {\n    ...OrganizationFilter_Query\n    ...CategoryFilter_Query\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Action_EventFragment on Event {\n    id\n    signUpDetails {\n      signUpsStartAt\n      signUpsEndAt\n    }\n    signUpAvailability\n    signUpsRetractable\n    signUpsRequireUserProvidedInformation\n    signUp {\n      id\n      participationStatus\n      approximatePositionOnWaitList\n    }\n  }\n"): (typeof documents)["\n  fragment Action_EventFragment on Event {\n    id\n    signUpDetails {\n      signUpsStartAt\n      signUpsEndAt\n    }\n    signUpAvailability\n    signUpsRetractable\n    signUpsRequireUserProvidedInformation\n    signUp {\n      id\n      participationStatus\n      approximatePositionOnWaitList\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation EventSignUp($data: SignUpInput!) {\n        signUp(data: $data) {\n          signUp {\n            id\n            participationStatus\n            event {\n              user {\n                ticket {\n                  id\n                  paymentStatus\n                }\n              }\n              id\n              signUpAvailability\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation EventSignUp($data: SignUpInput!) {\n        signUp(data: $data) {\n          signUp {\n            id\n            participationStatus\n            event {\n              user {\n                ticket {\n                  id\n                  paymentStatus\n                }\n              }\n              id\n              signUpAvailability\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation EventRetractSignUp($data: RetractSignUpInput!) {\n        retractSignUp(data: $data) {\n          signUp {\n            id\n            participationStatus\n            event {\n              id\n              signUpAvailability\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation EventRetractSignUp($data: RetractSignUpInput!) {\n        retractSignUp(data: $data) {\n          signUp {\n            id\n            participationStatus\n            event {\n              id\n              signUpAvailability\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query UseCountdownServerTime {\n        serverTime {\n          serverTime\n        }\n      }\n    "): (typeof documents)["\n      query UseCountdownServerTime {\n        serverTime {\n          serverTime\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventSignUp_EventFragment on Event {\n    signUpAvailability\n    id\n    user {\n      id\n      signUp {\n        id\n        participationStatus\n        approximatePositionOnWaitList\n      }\n      ticket {\n        id\n        paymentStatus\n      }\n    }\n    ticketInformation {\n      product {\n        id\n        price {\n          valueInNok\n        }\n      }\n    }\n    ...Action_EventFragment\n  }\n"): (typeof documents)["\n  fragment EventSignUp_EventFragment on Event {\n    signUpAvailability\n    id\n    user {\n      id\n      signUp {\n        id\n        participationStatus\n        approximatePositionOnWaitList\n      }\n      ticket {\n        id\n        paymentStatus\n      }\n    }\n    ticketInformation {\n      product {\n        id\n        price {\n          valueInNok\n        }\n      }\n    }\n    ...Action_EventFragment\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventLayout_Event on Event {\n    id\n    name\n    shortDescription\n    organization {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment EventLayout_Event on Event {\n    id\n    name\n    shortDescription\n    organization {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query EventLayout_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            ...EventLayout_Event\n          }\n        }\n      }\n    "): (typeof documents)["\n      query EventLayout_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            ...EventLayout_Event\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EventPage_EventQuery($data: EventInput!) {\n    event(data: $data) {\n      event {\n        id\n        name\n        description\n        signUpsEnabled\n        location\n        signUpsRetractable\n        endAt\n        startAt\n        contactEmail\n        ticketInformation {\n          product {\n            id\n            price {\n              valueInNok\n            }\n          }\n        }\n        categories {\n          id\n          name\n        }\n        ...EventSignUp_EventFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query EventPage_EventQuery($data: EventInput!) {\n    event(data: $data) {\n      event {\n        id\n        name\n        description\n        signUpsEnabled\n        location\n        signUpsRetractable\n        endAt\n        startAt\n        contactEmail\n        ticketInformation {\n          product {\n            id\n            price {\n              valueInNok\n            }\n          }\n        }\n        categories {\n          id\n          name\n        }\n        ...EventSignUp_EventFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SelectMerchant_Merchant on Merchant {\n    id\n    name\n  }\n"): (typeof documents)["\n  fragment SelectMerchant_Merchant on Merchant {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TicketEventForm_Merchant on Merchant {\n    id\n    name\n    ...SelectMerchant_Merchant\n  }\n"): (typeof documents)["\n  fragment TicketEventForm_Merchant on Merchant {\n    id\n    name\n    ...SelectMerchant_Merchant\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CreateBasicEventPage_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query CreateBasicEventPage_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CreateBasicEventPage_CreateEvent($data: CreateEventInput!) {\n        createEvent(data: $data) {\n          event {\n            id\n            organization {\n              id\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation CreateBasicEventPage_CreateEvent($data: CreateEventInput!) {\n        createEvent(data: $data) {\n          event {\n            id\n            organization {\n              id\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CreateSignUpEventPage_CreateEvent($data: CreateEventInput!) {\n        createEvent(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation CreateSignUpEventPage_CreateEvent($data: CreateEventInput!) {\n        createEvent(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CreateSignUpEventPage_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query CreateSignUpEventPage_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CreateTicketEventPage_CreateEvent($data: CreateEventInput!) {\n        createEvent(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation CreateTicketEventPage_CreateEvent($data: CreateEventInput!) {\n        createEvent(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query CreateTicketEventPage_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n\n        merchants {\n          merchants {\n            ...TicketEventForm_Merchant\n            id\n            name\n          }\n        }\n      }\n    "): (typeof documents)["\n      query CreateTicketEventPage_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n\n        categories {\n          categories {\n            id\n            name\n          }\n        }\n\n        merchants {\n          merchants {\n            ...TicketEventForm_Merchant\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListingItem_Listing on Listing {\n    id\n    name\n    closesAt\n    organization {\n      id\n      name\n      logo {\n        id\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ListingItem_Listing on Listing {\n    id\n    name\n    closesAt\n    organization {\n      id\n      name\n      logo {\n        id\n        url\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Listings_Query on Query {\n    listings {\n      listings {\n        id\n        ...ListingItem_Listing\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment Listings_Query on Query {\n    listings {\n      listings {\n        id\n        ...ListingItem_Listing\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ListingsPage_Query {\n        ...Listings_Query\n      }\n    "): (typeof documents)["\n      query ListingsPage_Query {\n        ...Listings_Query\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListingPage_Query($data: ListingInput!) {\n    listing(data: $data) {\n      listing {\n        id\n        description\n        ...TitleCard_Listing\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListingPage_Query($data: ListingInput!) {\n    listing(data: $data) {\n      listing {\n        id\n        description\n        ...TitleCard_Listing\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TitleCard_Listing on Listing {\n    name\n    applicationUrl\n    closesAt\n    organization {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment TitleCard_Listing on Listing {\n    name\n    applicationUrl\n    closesAt\n    organization {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ListingLayout_Query($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ListingLayout_Query($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ListingMetadata($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            description\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ListingMetadata($data: ListingInput!) {\n        listing(data: $data) {\n          listing {\n            id\n            name\n            description\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query NewListing_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query NewListing_Query {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation NewListing_CreateListingMutation($data: CreateListingInput!) {\n        createListing(data: $data) {\n          listing {\n            id\n            name\n            description\n            closesAt\n            organization {\n              id\n              name\n            }\n            applicationUrl\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation NewListing_CreateListingMutation($data: CreateListingInput!) {\n        createListing(data: $data) {\n          listing {\n            id\n            name\n            description\n            closesAt\n            organization {\n              id\n              name\n            }\n            applicationUrl\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query LoginPage_UserQuery {\n        user {\n          user {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      query LoginPage_UserQuery {\n        user {\n          user {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationsAdminEventsAboutPage_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            startAt\n            endAt\n            type\n            location\n            contactEmail\n            ticketInformation {\n              product {\n                id\n                price {\n                  valueInNok\n                }\n              }\n            }\n            organization {\n              id\n              name\n            }\n            signUps {\n              confirmed {\n                total\n              }\n              waitList {\n                total\n              }\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationsAdminEventsAboutPage_EventQuery($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            startAt\n            endAt\n            type\n            location\n            contactEmail\n            ticketInformation {\n              product {\n                id\n                price {\n                  valueInNok\n                }\n              }\n            }\n            organization {\n              id\n              name\n            }\n            signUps {\n              confirmed {\n                total\n              }\n              waitList {\n                total\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query EventAdminLayout_Event($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query EventAdminLayout_Event($data: EventInput!) {\n        event(data: $data) {\n          event {\n            id\n            name\n            organization {\n              id\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrganizationsAdminEventsSignUpsPage_SignUp on SignUp {\n    id\n    createdAt\n    userProvidedInformation\n    order {\n      id\n      paymentStatus\n    }\n    user {\n      id\n      firstName\n      lastName\n      gradeYear\n      username\n    }\n  }\n"): (typeof documents)["\n  fragment OrganizationsAdminEventsSignUpsPage_SignUp on SignUp {\n    id\n    createdAt\n    userProvidedInformation\n    order {\n      id\n      paymentStatus\n    }\n    user {\n      id\n      firstName\n      lastName\n      gradeYear\n      username\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OrganizationsAdminEventsSignUpsPage_EventQuery($data: EventInput!) {\n    event(data: $data) {\n      event {\n        id\n        type\n        signUpsRequireUserProvidedInformation\n        signUps {\n          confirmed {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n          waitList {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n          retracted {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n          removed {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query OrganizationsAdminEventsSignUpsPage_EventQuery($data: EventInput!) {\n    event(data: $data) {\n      event {\n        id\n        type\n        signUpsRequireUserProvidedInformation\n        signUps {\n          confirmed {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n          waitList {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n          retracted {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n          removed {\n            total\n            signUps {\n              ...OrganizationsAdminEventsSignUpsPage_SignUp\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation OrganizationsAdminEventsSignUpsPage_RemoveSignUp($data: RemoveSignUpInput!) {\n        removeSignUp(data: $data) {\n          signUp {\n            id\n            participationStatus\n            user {\n              id\n              firstName\n              lastName\n            }\n            event {\n              id\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation OrganizationsAdminEventsSignUpsPage_RemoveSignUp($data: RemoveSignUpInput!) {\n        removeSignUp(data: $data) {\n          signUp {\n            id\n            participationStatus\n            user {\n              id\n              firstName\n              lastName\n            }\n            event {\n              id\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AdminOrganizationsEventsPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            events {\n              type\n              signUps {\n                confirmed {\n                  total\n                }\n              }\n              id\n              name\n              startAt\n              signUpDetails {\n                capacity\n              }\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AdminOrganizationsEventsPage($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            events {\n              type\n              signUps {\n                confirmed {\n                  total\n                }\n              }\n              id\n              name\n              startAt\n              signUpDetails {\n                capacity\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationPageLayout($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n            colorScheme\n            logo {\n              id\n              url\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationPageLayout($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n            colorScheme\n            logo {\n              id\n              url\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AdminOrganizationsPageListings($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            listings {\n              id\n              name\n              closesAt\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query AdminOrganizationsPageListings($data: OrganizationInput!) {\n        organization(data: $data) {\n          organization {\n            id\n            listings {\n              id\n              name\n              closesAt\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AddMemberDialog_Member on Member {\n    id\n    user {\n      id\n      firstName\n      lastName\n    }\n    organization {\n      id\n    }\n    role\n  }\n"): (typeof documents)["\n  fragment AddMemberDialog_Member on Member {\n    id\n    user {\n      id\n      firstName\n      lastName\n    }\n    organization {\n      id\n    }\n    role\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation OrganizationsAdminMembersPage_AddMember($data: AddMemberInput!) {\n        addMember(data: $data) {\n          ... on AddMemberSuccessResponse {\n            member {\n              ...AddMemberDialog_Member\n            }\n          }\n          ... on AddMemberErrorResponse {\n            code\n            message\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation OrganizationsAdminMembersPage_AddMember($data: AddMemberInput!) {\n        addMember(data: $data) {\n          ... on AddMemberSuccessResponse {\n            member {\n              ...AddMemberDialog_Member\n            }\n          }\n          ... on AddMemberErrorResponse {\n            code\n            message\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AdminOrganizationsPageMembers($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            members {\n              id\n              user {\n                id\n                firstName\n                lastName\n              }\n              role\n            }\n          }\n        }\n        user {\n          user {\n            id\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: ADMIN }) {\n          hasRole\n        }\n      }\n    "): (typeof documents)["\n      query AdminOrganizationsPageMembers($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            members {\n              id\n              user {\n                id\n                firstName\n                lastName\n              }\n              role\n            }\n          }\n        }\n        user {\n          user {\n            id\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: ADMIN }) {\n          hasRole\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation OrganizationsAdminMembersPage_UpdateRole($data: UpdateRoleInput!) {\n        updateRole(data: $data) {\n          member {\n            id\n            role\n            user {\n              id\n              firstName\n              lastName\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation OrganizationsAdminMembersPage_UpdateRole($data: UpdateRoleInput!) {\n        updateRole(data: $data) {\n          member {\n            id\n            role\n            user {\n              id\n              firstName\n              lastName\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation OrganizationsAdminMembersPage_RemoveMember($data: RemoveMemberInput!) {\n        removeMember(data: $data) {\n          member {\n            id\n            user {\n              id\n              firstName\n              lastName\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation OrganizationsAdminMembersPage_RemoveMember($data: RemoveMemberInput!) {\n        removeMember(data: $data) {\n          member {\n            id\n            user {\n              id\n              firstName\n              lastName\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrganizationsAdminEditPage_OrganizationFragment on Organization {\n    id\n    colorScheme\n    logo {\n      url\n      id\n    }\n    name\n    description\n    featurePermissions\n  }\n"): (typeof documents)["\n  fragment OrganizationsAdminEditPage_OrganizationFragment on Organization {\n    id\n    colorScheme\n    logo {\n      url\n      id\n    }\n    name\n    description\n    featurePermissions\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationsAdminEditPage_IsSuperUser($data: OrganizationInput!) {\n        user {\n          user {\n            id\n            isSuperUser\n          }\n        }\n        organization(data: $data) {\n          organization {\n            ...OrganizationsAdminEditPage_OrganizationFragment\n          }\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationsAdminEditPage_IsSuperUser($data: OrganizationInput!) {\n        user {\n          user {\n            id\n            isSuperUser\n          }\n        }\n        organization(data: $data) {\n          organization {\n            ...OrganizationsAdminEditPage_OrganizationFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation OrganizationsAdminEditPage($data: UpdateOrganizationInput!) {\n        updateOrganization(data: $data) {\n          organization {\n            ...OrganizationsAdminEditPage_OrganizationFragment\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation OrganizationsAdminEditPage($data: UpdateOrganizationInput!) {\n        updateOrganization(data: $data) {\n          organization {\n            ...OrganizationsAdminEditPage_OrganizationFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation OrganizationsAdminEditPageUploadFile($data: UploadFileInput!) {\n        uploadFile(data: $data) {\n          sasUrl\n          file {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation OrganizationsAdminEditPageUploadFile($data: UploadFileInput!) {\n        uploadFile(data: $data) {\n          sasUrl\n          file {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationLayout_Organization($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationLayout_Organization($organizationId: ID!) {\n        organization(data: { id: $organizationId }) {\n          organization {\n            id\n            name\n          }\n        }\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OrganizationAdminLayout_HasRole($organizationId: ID!) {\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    "): (typeof documents)["\n      query OrganizationAdminLayout_HasRole($organizationId: ID!) {\n        hasRole(data: { organizationId: $organizationId, role: MEMBER }) {\n          hasRole\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CabinsAdminCard_Query on Query {\n    bookings(data: { status: PENDING }) {\n      total\n      bookings {\n        id\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment CabinsAdminCard_Query on Query {\n    bookings(data: { status: PENDING }) {\n      total\n      bookings {\n        id\n        status\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppProfileUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            gradeYear\n            isSuperUser\n            studyProgram {\n              id\n              name\n            }\n          }\n        }\n\n        ...CabinsAdminCard_Query\n      }\n    "): (typeof documents)["\n      query AppProfileUser {\n        user {\n          user {\n            id\n            firstName\n            lastName\n            gradeYear\n            isSuperUser\n            studyProgram {\n              id\n              name\n            }\n          }\n        }\n\n        ...CabinsAdminCard_Query\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppProfileCabinPermission {\n        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "): (typeof documents)["\n      query AppProfileCabinPermission {\n        hasFeaturePermission(data: { featurePermission: CABIN_ADMIN }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query AppProfileDocumentsPermission {\n        hasFeaturePermission(data: { featurePermission: ARCHIVE_WRITE_DOCUMENTS }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "): (typeof documents)["\n      query AppProfileDocumentsPermission {\n        hasFeaturePermission(data: { featurePermission: ARCHIVE_WRITE_DOCUMENTS }) {\n          id\n          hasFeaturePermission\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserForm_User on PrivateUser {\n    firstName\n    lastName\n    phoneNumber\n    graduationYear\n    allergies\n    graduationYearUpdatedAt\n    canUpdateYear\n    gradeYear\n    email\n    studyProgram {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment UserForm_User on PrivateUser {\n    firstName\n    lastName\n    phoneNumber\n    graduationYear\n    allergies\n    graduationYearUpdatedAt\n    canUpdateYear\n    gradeYear\n    email\n    studyProgram {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProfileEditPage_User {\n    user {\n      user {\n        id\n        ...UserForm_User\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProfileEditPage_User {\n    user {\n      user {\n        id\n        ...UserForm_User\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation ProfileEditPage_UpdateUser($data: UpdateUserInput!) {\n        updateUser(data: $data) {\n          user {\n            id\n            ...UserForm_User\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation ProfileEditPage_UpdateUser($data: UpdateUserInput!) {\n        updateUser(data: $data) {\n          user {\n            id\n            ...UserForm_User\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrderStatus_SignUp on SignUp {\n    order {\n      id\n      paymentStatus\n      totalPrice {\n        valueInNok\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment OrderStatus_SignUp on SignUp {\n    order {\n      id\n      paymentStatus\n      totalPrice {\n        valueInNok\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ParticipationStatus_SignUp on SignUp {\n    participationStatus\n    approximatePositionOnWaitList\n  }\n"): (typeof documents)["\n  fragment ParticipationStatus_SignUp on SignUp {\n    participationStatus\n    approximatePositionOnWaitList\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ProfileEventsPage($data: UserSignUpsInput) {\n        user {\n          user {\n            id\n            all: signUps(data: { participationStatus: null }) {\n              total\n            }\n            confirmed: signUps(data: { participationStatus: CONFIRMED }) {\n              total\n            }\n            onWaitlist: signUps(data: { participationStatus: ON_WAITLIST }) {\n              total\n            }\n            retracted: signUps(data: { participationStatus: RETRACTED }) {\n              total\n            }\n            removed: signUps(data: { participationStatus: REMOVED }) {\n              total\n            }\n            signUps(data: $data) {\n              signUps {\n                id\n                createdAt\n                event {\n                  id\n                  name\n                  startAt\n                  type\n                }\n                ...OrderStatus_SignUp\n                ...ParticipationStatus_SignUp\n              }\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ProfileEventsPage($data: UserSignUpsInput) {\n        user {\n          user {\n            id\n            all: signUps(data: { participationStatus: null }) {\n              total\n            }\n            confirmed: signUps(data: { participationStatus: CONFIRMED }) {\n              total\n            }\n            onWaitlist: signUps(data: { participationStatus: ON_WAITLIST }) {\n              total\n            }\n            retracted: signUps(data: { participationStatus: RETRACTED }) {\n              total\n            }\n            removed: signUps(data: { participationStatus: REMOVED }) {\n              total\n            }\n            signUps(data: $data) {\n              signUps {\n                id\n                createdAt\n                event {\n                  id\n                  name\n                  startAt\n                  type\n                }\n                ...OrderStatus_SignUp\n                ...ParticipationStatus_SignUp\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ProfileLayout_UserQuery {\n        user {\n          user {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ProfileLayout_UserQuery {\n        user {\n          user {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ProfileOrdersPage {\n        orders {\n          orders {\n            id\n            createdAt\n            capturedPaymentAttempt {\n              id\n              reference\n              state\n            }\n            product {\n              id\n              name\n            }\n            totalPrice {\n              valueInNok\n            }\n            purchasedAt\n            paymentStatus\n            isFinalState\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query UserOrganizationsPage {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n              logo {\n                id\n                url\n              }\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query UserOrganizationsPage {\n        user {\n          user {\n            id\n            organizations {\n              id\n              name\n              logo {\n                id\n                url\n              }\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ReceiptLayout_Order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ReceiptLayout_Order($data: OrderInput!) {\n        order(data: $data) {\n          order {\n            id\n            product {\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ReceiptPage_Order($data: OrderInput!, $reference: String) {\n    order(data: $data) {\n      order {\n        id\n        isFinalState\n        purchasedAt\n        product {\n          id\n          name\n          description\n        }\n        paymentAttempt(reference: $reference) {\n          id\n          state\n          reference\n          isFinalState\n        }\n        capturedPaymentAttempt {\n          id\n          state\n          reference\n        }\n        paymentStatus\n        totalPrice {\n          value\n          unit\n          valueInNok\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ReceiptPage_Order($data: OrderInput!, $reference: String) {\n    order(data: $data) {\n      order {\n        id\n        isFinalState\n        purchasedAt\n        product {\n          id\n          name\n          description\n        }\n        paymentAttempt(reference: $reference) {\n          id\n          state\n          reference\n          isFinalState\n        }\n        capturedPaymentAttempt {\n          id\n          state\n          reference\n        }\n        paymentStatus\n        totalPrice {\n          value\n          unit\n          valueInNok\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;