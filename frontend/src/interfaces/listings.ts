export interface ListingType {
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
    allListings: ListingType[];
}

export interface CreateListingData {
    createListing: {
        listing: ListingType;
    };
}
