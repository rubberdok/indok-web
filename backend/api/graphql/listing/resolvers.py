from apps.listing.models import Listing, Response
from django.db.models import Q
from graphql_jwt.decorators import login_required
from apps.users.models import User
from typing import Optional

class ListingResolvers:
    def resolve_listings(parent, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(organization__name__icontains=search)
            )
            return Listing.objects.filter(filter)
        return Listing.objects.all()

    def resolve_listing(parent, info, id):
        try:
            return Listing.objects.get(pk=id)
        except Listing.DoesNotExist:
            return None


class ResponseResolvers:
    @login_required
    def resolve_response(root, info, listing_id=None, id=None) -> Optional[Response]:
        user: User = info.context.user
        responses = user.responses
        if listing_id:
            return responses.filter(listing_id=listing_id).first()
        if id:
            return responses.get(pk=id)
        return None