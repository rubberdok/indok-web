import { getByTestId } from "../helpers/feide";

describe("Profile edit form", () => {
  it("renders editable profile fields", () => {
    cy.visit("/profile/edit");

    getByTestId("editUser-title").should("be.visible");
    getByTestId("editUser-title").should("contain.text", "Oppdater profil");
    getByTestId("editUser-firstNameTextField").find("input").should("be.visible");
    getByTestId("editUser-lastNameTextField").find("input").should("be.visible");
    getByTestId("editUser-emailTextField").find("input").should("be.visible");
    getByTestId("editUser-phoneNumberTextField").find("input").should("be.visible");
    getByTestId("editUser-graduationYearSelect").should("be.visible");
    getByTestId("editUser-saveButton").should("be.visible").and("contain.text", "Lagre");
  });
});
