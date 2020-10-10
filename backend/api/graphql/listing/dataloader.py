from collections import defaultdict

from promise import Promise
from promise.dataloader import DataLoader
from apps.listing.models import Listing, Response

class ResponsesByListingIdLoader(DataLoader):
    def batch_load_fn(self, keys):
        listing_to_responses = defaultdict(list)
        responses = Response.objects.filter(listing_id__in=keys)

        for response in responses.iterator():
            listing_to_responses[response.listing_id].append(response)
        return Promise.resolve([listing_to_responses[listing_id] for listing_id in keys])

