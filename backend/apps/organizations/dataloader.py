from collections import defaultdict

from promise import Promise
from promise.dataloader import DataLoader

from ..listings.models import Listing


class ListingsByOrganizationIdLoader(DataLoader):
    def batch_load_fn(self, keys):
        organization_to_listings = defaultdict(list)
        listings = Listing.objects.filter(organization_id__in=keys)

        for listing in listings.iterator():
            organization_to_listings[listing.organization_id].append(listing)
        return Promise.resolve([organization_to_listings[organization_id] for organization_id in keys])
