from ..listings.models import Listing
from graphene.utils.dataloader import DataLoader
from asgiref.sync import sync_to_async
from collections import defaultdict


class ListingsByOrganizationIdLoader(DataLoader):
    async def batch_load_fn(self, keys):
        return await sync_to_async(self._load)(keys)

    def _load(self, keys):
        organization_to_listings = defaultdict(list)
        listings = Listing.objects.filter(organization_id__in=keys)

        for listing in listings.iterator():
            organization_to_listings[listing.organization_id].append(listing)
        return [organization_to_listings[organization_id] for organization_id in keys]
