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

export interface AllListingsData {
    allListings: Listing[];
}

export interface CreateListingData {
    createListing: {
        listing: Listing;
    };
}

export interface ListingByIdData {
    listingById: Listing;
}
