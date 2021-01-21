from apps.listing.models import Listing, Response
from django.db.models import Q
from graphql_jwt.decorators import login_required
from apps.users.models import User

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
    def resolve_response(root, info, id) -> Response:
        user: User = info.context.user
        return user.responses.get(pk=id)
    
    @login_required
    def resolve_response_by_listing_id(self, info, listing_id) -> Response:
        user: User = info.context.user
        response: Response = user.responses.filter(listing_id=listing_id).first()
        print(response)
        return response