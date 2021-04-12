import MarkdownForm from "@components/pages/listings/detail/MarkdownForm";
import { ListingInput } from "@interfaces/listings"
import ListingBanner from "./ListingBanner";

interface EditListingProps {
  listingState: ListingInput,
  setListingState: (listing: ListingInput) => void,
}

const EditListing: React.FC<EditListingProps> = ({ listingState, setListingState }) => {
  return (
    <>
      <ListingBanner />
      <MarkdownForm markdown={listingState.description} onChange={(event) => setListingState({...listingState, description: event.target.value})} />
    </>
  )
}

export default EditListing;