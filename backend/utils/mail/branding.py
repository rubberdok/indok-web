"""
Single source of truth for the colours used in transactional email templates.

Email clients do not run the frontend's MUI theme, so these values are kept here
and exposed to templates through the `email_branding` tag library rather than
being repeated in every template.

Keep in sync with the frontend palette in
`frontend/src/lib/mui/theme/colorSchemes/janus.ts`. The backend container only
mounts `backend/`, so it cannot read that file directly.
"""

from django import template

register = template.Library()

EMAIL_COLORS = {
    "primary": "#800020",
    "surface": "#f5f0eb",
}


@register.simple_tag
def email_color(name: str = "primary") -> str:
    """
    Return a branding colour for use in an email template, e.g.

        {% load email_branding %}
        <div style="border: 5px solid {% email_color 'primary' %};">
    """
    try:
        return EMAIL_COLORS[name]
    except KeyError:
        raise template.TemplateSyntaxError(
            f"Unknown email colour '{name}'. Available: {sorted(EMAIL_COLORS)}"
        )
