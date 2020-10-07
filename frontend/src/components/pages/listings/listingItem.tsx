import { ListingType } from "@interfaces/listings";
import Link from "next/link";

const ListingItem = (listing: ListingType) => (
    <li>
        <Link href={`/listings/${listing.id}`}>
            <a>{listing.title}</a>
        </Link>
        <p>
            {listing.organization.name} - frist: {listing.deadline}
        </p>
    </li>
);

export default ListingItem;
