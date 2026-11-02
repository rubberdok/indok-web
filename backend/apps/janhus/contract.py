"""
The JanHus rental contract. One text, templates/janhus_contract_body.html, is both what the booker reads and accepts on
the booking page and what they get as a PDF when the booking is confirmed, so the two cannot drift apart.
"""

from django.template.loader import render_to_string
from django.utils import timezone

from apps.janhus.models import JanHusArea, JanHusBooking
from apps.janhus.rules import get_or_create_settings

CONTRACT_BODY_TEMPLATE = "janhus_contract_body.html"
DATE_FORMAT = "%d.%m.%Y"
TIME_FORMAT = "%H:%M"


def _kroner(amount: int) -> str:
    return f"{amount:,}".replace(",", "\u00a0")


def contract_context(booking: JanHusBooking, *, reveal_key_box_code: bool) -> dict:
    """
    The contract's blanks, filled in from the booking and the settings. The booker is the tenant, since they are the
    one who accepts the contract. The code is left out of everything anyone can read before a booking is confirmed.
    """
    booking_settings = get_or_create_settings()
    starts_at = timezone.localtime(booking.starts_at)
    ends_at = timezone.localtime(booking.ends_at)
    return {
        "reference": booking.reference,
        "contact_name": booking_settings.booking_contact_name,
        "contact_phone": booking_settings.booking_contact_phone,
        "tenant_name": (booking.booker_name or booking.responsible_name or "").strip(),
        "tenant_phone": booking.booker_phone or booking.responsible_phone,
        "tenant_email": booking.booker_email or booking.responsible_email,
        "area_name": booking.area.name,
        "start_date": starts_at.strftime(DATE_FORMAT),
        "start_time": starts_at.strftime(TIME_FORMAT),
        "end_date": ends_at.strftime(DATE_FORMAT),
        "end_time": ends_at.strftime(TIME_FORMAT),
        "occasion": booking.occasion,
        "address": booking_settings.contract_address,
        "rent_amount": _kroner(booking_settings.contract_rent_amount),
        "max_fee": _kroner(booking_settings.contract_max_fee),
        "cleaning_deadline_hours": booking_settings.contract_cleaning_deadline_hours,
        # For a price per booking, with section 3 in the template. The preview must then also get what the price
        # depends on: event type, cleaning, the organisation, and whether the booker is logged in.
        # "total_price": booking.total_price,
        # "deposit_amount": booking.deposit_amount,
        # "cleaning_fee": booking.area.cleaning_fee if booking.cleaning_requested else None,
        "reveal_key_box_code": reveal_key_box_code,
        "key_box_code": booking_settings.key_box_code if reveal_key_box_code else "",
    }


def render_contract_preview(data: dict, *, area: JanHusArea) -> str:
    """
    The contract as HTML for the booking page, from what the booker has filled in so far. Nothing is saved.
    """
    booking = JanHusBooking(
        starts_at=data["starts_at"],
        ends_at=data["ends_at"],
        area=area,
        booker_name=data.get("requester_name", ""),
        booker_email=data.get("requester_email", ""),
        booker_phone=data.get("requester_phone", ""),
        occasion=data.get("occasion", ""),
    )
    return render_to_string(CONTRACT_BODY_TEMPLATE, contract_context(booking, reveal_key_box_code=False))
