export interface Listing {
    id: string;
    title: string;
    description: string;
    startDateTime: string;
    deadline: string;
    endDateTime: string;
    url: string;
    slug: string;
    organization: { id: string; name: string };
}

export interface ListingsData {
    listings: Listing[];
}

export interface CreateListingData {
    createListing: {
        listing: Listing;
    };
}

export interface ListingData {
    listing: Listing;
}
