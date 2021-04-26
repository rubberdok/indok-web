from django.db import models


def number_of_nights(check_out, check_in):
    return (check_out - check_in).days


def is_internal_price(internal_participants, external_participants):
    return internal_participants >= external_participants


def price(cabins, check_in, check_out, internal_participants, external_participants):
    if is_internal_price(internal_participants, external_participants):
        price_pr_night = cabins.aggregate(models.Sum("internal_price"))[
            "internal_price__sum"
        ]
    else:
        price_pr_night = cabins.aggregate(models.Sum("external_price"))[
            "external_price__sum"
        ]
    return price_pr_night * number_of_nights(check_out, check_in)
