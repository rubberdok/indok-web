type MockUser = {
  id: string;
  feideEmail: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dateJoined: string;
  graduationYear: number;
  gradeYear: number;
  allergies: string;
  phoneNumber: string;
  firstLogin: boolean;
  canUpdateYear: boolean;
  yearUpdatedAt: string;
  nfcUidHex: string;
  nfcPinCode: string;
  nfcPermanentAccess: boolean;
};

const createMockUser = (): MockUser => ({
  id: "42",
  feideEmail: "asbjorn@example.com",
  email: "asbjorn@example.com",
  username: "asbjorn_elevg",
  firstName: "Asbjørn",
  lastName: "Elev",
  dateJoined: "2024-08-01T12:00:00+00:00",
  graduationYear: 2029,
  gradeYear: 2,
  allergies: "",
  phoneNumber: "12345678",
  firstLogin: false,
  canUpdateYear: true,
  yearUpdatedAt: "2025-09-01T12:00:00+00:00",
  nfcUidHex: "",
  nfcPinCode: "",
  nfcPermanentAccess: false,
});

export const mockAuthenticatedGraphQL = () => {
  const userState: MockUser = createMockUser();

  cy.intercept("POST", "**/graphql/**", (req) => {
    const operationNameFromBody = req.body?.operationName as string | undefined;
    const operationNameFromQuery =
      typeof req.body?.query === "string"
        ? (req.body.query.match(/\b(?:query|mutation)\s+([A-Za-z0-9_]+)/)?.[1] as string | undefined)
        : undefined;
    const operationName = operationNameFromBody || operationNameFromQuery;

    if (operationName) {
      req.alias = `gql${operationName}`;
    }

    switch (operationName) {
      case "user":
      case "Profile":
        req.reply({ data: { user: userState } });
        return;

      case "CabinPermission":
      case "JanHusPermission":
        req.reply({ data: { hasPermission: false } });
        return;

      case "ProfileAdminEditCapabilities":
      case "adminEditCapabilities":
        req.reply({ data: { canManageUserProfiles: false, canManageUserNfc: false } });
        return;

      case "userToEdit":
        req.reply({ data: { user: userState } });
        return;

      case "userNfcSettings":
        req.reply({
          data: {
            nfcSelfServiceEnabled: true,
            nfcAccepts4ByteUid: false,
            nfcAccepts7ByteUid: true,
          },
        });
        return;

      case "updateUser": {
        const userData = (req.body?.variables?.userData ?? {}) as Partial<MockUser>;
        Object.assign(userState, userData);
        req.reply({ data: { updateUser: { user: userState } } });
        return;
      }

      default:
        req.continue();
    }
  });
};
