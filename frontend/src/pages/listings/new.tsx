import { NextPage } from "next";
import NewListing from "@components/pages/listings/NewListing";

/**
 * @description Page for creating new listings, navigates to the newly created listing upon completion
 */
const NewListingPage: NextPage = () => {
  return (
    <NewListing />
  );
};
export default NewListingPage;
