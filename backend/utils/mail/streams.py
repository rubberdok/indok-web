from __future__ import annotations

import warnings
from typing import (
    TYPE_CHECKING,
    Any,
    Literal,
    Optional,
    Sequence,
    Tuple,
    TypedDict,
    Union,
    get_args,
)

from django.conf import settings

if TYPE_CHECKING:
    from email.mime.base import MIMEBase

from django.core.mail import EmailMultiAlternatives

TransactionalStream = Literal[
    "order-confirmations", "cabin-booking-confirmations", "wait-list-notifications", "event-updates"
]
BroadcastStream = Literal["event-notifications"]
TemplateVariables = dict[
    str,
    Union[
        dict[str, Union["TemplateVariables", str, list["TemplateVariables"]]],
        str,
        list["TemplateVariables"],
    ],
]

TRANSACTIONAL_STREAMS: tuple[TransactionalStream, ...] = get_args(TransactionalStream)
BROADCAST_STREAMS: tuple[BroadcastStream, ...] = get_args(BroadcastStream)


class EspExtra(TypedDict):
    MessageStream: Union[TransactionalStream, BroadcastStream]


class PostmarkEmail(EmailMultiAlternatives):
    """
    Wrapper for EmailMultiAlternatives to add extra fields required for Postmark.
    """

    def __init__(
        self,
        stream: Union[TransactionalStream, BroadcastStream],
        template_id: Optional[Union[str, int]] = None,
        template_variables: Optional[TemplateVariables] = None,
        global_template_variables: Optional[TemplateVariables] = None,
        subject: str = "",
        body: str = "",
        from_email: Optional[str] = None,
        to: Optional[Sequence[str]] = None,
        bcc: Optional[Sequence[str]] = None,
        connection: Optional[Any] = None,
        attachments: Optional[Sequence[Union[MIMEBase, tuple]]] = None,
        headers: Optional[dict[str, str]] = None,
        alternatives: Optional[Sequence[Tuple[Any, str]]] = None,
        cc: Optional[Sequence[str]] = None,
        reply_to: Optional[Sequence[str]] = None,
    ) -> None:
        """
        -----
        NEVER USE THIS FOR PROMOTIONAL EMAILS,
        NEWSLETTERS, OR OTHER, NON-ESSENTIAL COMMUNICATION.
        -----

        Wrapper for EmailMultiAlternatives to add extra fields required for Postmark.

        https://postmarkapp.com/transactional-email

        Typically one-to-one, and do not have an unsubscribe link.

        Parameters
        ----------
        stream : TransactionalStream
            The Postmark message stream
        template_id : Optional[Union[str, int]], optional
            Either the numeric id, or the string identifier (not the same as the name)
            of the template, by default None
        template_variables : Optional[TemplateVariables], optional
            User-specific variables for the Postmark template,
            a dictionary of emails and their corresponding variables, by default None
            Importantly, if the e-mail has multiple recipients,
            this should always be included, even as an empty dictionary if there are no
            user specific variables. Otherwise, `to`-receivers will be visible to all receivers.
        global_template_variables : Optional[TemplateVariables], optional
            Template variables shared across all receivers, by default None
        subject : str, optional
            Subject of the e-mail, must be blank if using a template, by default ""
        body : str, optional
            Body of the e-mail, blank if using a template, by default ""
        from_email : Optional[str], optional
            From email to be displayed, by default None
        to : Optional[Sequence[str]], optional
            Receivers, by default None
        bcc : Optional[Sequence[str]], optional
            Blind carbon copy, by default None
        connection : Optional[Any], optional
        attachments : Optional[Sequence[Union[MIMEBase, tuple]]], optional
        headers : Optional[dict[str, str]], optional
        alternatives : Optional[Sequence[Tuple[Any, str]]], optional
        cc : Optional[Sequence[str]], optional
        reply_to : Optional[Sequence[str]], optional

        Raises
        ------
        ValueError
            If an appropriate stream is not set
        """
        if stream not in TRANSACTIONAL_STREAMS + BROADCAST_STREAMS:
            raise ValueError(
                f"Stream must be one of {TRANSACTIONAL_STREAMS}, or {BROADCAST_STREAMS}"
            )

        if template_variables is None:
            if to is not None and template_id is not None and len(to) > 1:
                warnings.warn(
                    """
                    As template_variables is None,
                    the mail will be sent with several recipients in the to-field,
                    potentially leaking emails.
                    """
                )
        elif emails := list(template_variables.keys()):
            if "@" not in emails[0]:
                warnings.warn(
                    """template_variables should have the following structure:
                    {
                        first@example.com: {
                            ...
                        },
                        second@example.com: {
                            ...
                        }
                    }
                    """
                )

        default_template_variables: TemplateVariables = {
            "company_name": "Rubberdøk",
            "parent_company": "Foreningen for Studenter ved Indøk",
            "website_url": settings.FRONTEND_BASE_URL,
            "contact_mail": settings.CONTACT_EMAIL,
        }
        self.esp_extra: EspExtra = {"MessageStream": stream}
        self.template_id = template_id
        self.merge_data = template_variables
        self.merge_global_data = (
            default_template_variables | global_template_variables
            if global_template_variables is not None
            else default_template_variables
        )

        super().__init__(
            subject,
            body,
            from_email,
            to,
            bcc,
            connection,
            attachments,
            headers,
            alternatives,
            cc,
            reply_to,
        )


class TransactionalEmail(PostmarkEmail):
    """
    -----------------
    NEVER USE THIS FOR PROMOTIONAL EMAILS,
    NEWSLETTERS, OR OTHER, NON-ESSENTIAL COMMUNICATION.
    -----------------

    Wrapper for EmailMultiAlternatives to add extra fields required for Postmark.

    https://postmarkapp.com/transactional-email

    Typically one-to-one, and do not have an unsubscribe link.
    """

    def __init__(
        self,
        stream: TransactionalStream,
        template_id: Optional[Union[str, int]] = None,
        template_variables: Optional[TemplateVariables] = None,
        global_template_variables: Optional[TemplateVariables] = None,
        subject: str = "",
        body: str = "",
        from_email: Optional[str] = None,
        to: Optional[Sequence[str]] = None,
        bcc: Optional[Sequence[str]] = None,
        connection: Optional[Any] = None,
        attachments: Optional[Sequence[Union[MIMEBase, tuple]]] = None,
        headers: Optional[dict[str, str]] = None,
        alternatives: Optional[Sequence[Tuple[Any, str]]] = None,
        cc: Optional[Sequence[str]] = None,
        reply_to: Optional[Sequence[str]] = None,
    ) -> None:
        """
        -----------------
        NEVER USE THIS FOR PROMOTIONAL EMAILS,
        NEWSLETTERS, OR OTHER, NON-ESSENTIAL COMMUNICATION.
        -----------------

        Wrapper for EmailMultiAlternatives to add extra fields required for Postmark.

        https://postmarkapp.com/transactional-email

        Typically one-to-one, and do not have an unsubscribe link.

        Parameters
        ----------
        stream : TransactionalStream
            The Postmark message stream
        template_id : Optional[Union[str, int]], optional
            Either the numeric id, or the string identifier
            (not the same as the name) of the temlate, by default None
        template_variables : Optional[TemplateVariables], optional
            User-specific variables for the Postmark template, a dictionary
            of emails and their corresponding variables, by default None
            Importantly, if the e-mail has multiple recipients,
            this should always be included, even as an empty dictionary if there are no
            user specific variables. Otherwise, `to`-receivers will be visible to all receivers.
        global_template_variables : Optional[TemplateVariables], optional
            Template variables shared across all receivers, by default None
        subject : str, optional
            Subject of the e-mail, must be blank if using a template, by default ""
        body : str, optional
            Body of the e-mail, blank if using a template, by default ""
        from_email : Optional[str], optional
            From email to be displayed, by default None
        to : Optional[Sequence[str]], optional
            Receivers, by default None
        bcc : Optional[Sequence[str]], optional
            Blind carbon copy, by default None
        connection : Optional[Any], optional
        attachments : Optional[Sequence[Union[MIMEBase, tuple]]], optional
        headers : Optional[dict[str, str]], optional
        alternatives : Optional[Sequence[Tuple[Any, str]]], optional
        cc : Optional[Sequence[str]], optional
        reply_to : Optional[Sequence[str]], optional

        Raises
        ------
        ValueError
            If an appropriate stream is not set
        """
        if stream not in TRANSACTIONAL_STREAMS:
            raise ValueError(f"Stream must be one of {TRANSACTIONAL_STREAMS}")
        super().__init__(
            stream=stream,
            template_id=template_id,
            template_variables=template_variables,
            global_template_variables=global_template_variables,
            subject=subject,
            body=body,
            from_email=from_email,
            to=to,
            bcc=bcc,
            connection=connection,
            attachments=attachments,
            headers=headers,
            alternatives=alternatives,
            cc=cc,
            reply_to=reply_to,
        )


class BroadcastEmail(PostmarkEmail):
    """
    Wrapper for EmailMultiAlternatives to add extra fields required for Postmark.

    Parameters
    ----------
    stream : TransactionalStream
        The Postmark message stream
    template_id : Optional[Union[str, int]], optional
        Either the numeric id, or the string identifier (not the same as the name) of the template,
        by default None
    template_variables : Optional[TemplateVariables], optional
        User-specific variables for the Postmark template,
        a dictionary of emails and their corresponding variables, by default None
        Importantly, if the e-mail has multiple recipients, this should always be included,
        even as an empty dictionary if there are no
        user specific variables. Otherwise, `to`-receivers will be visible to all receivers.
    global_template_variables : Optional[TemplateVariables], optional
        Template variables shared across all receivers, by default None
    subject : str, optional
        Subject of the e-mail, must be blank if using a template, by default ""
    body : str, optional
        Body of the e-mail, blank if using a template, by default ""
    from_email : Optional[str], optional
        From email to be displayed, by default None
    to : Optional[Sequence[str]], optional
        Receivers, by default None
    bcc : Optional[Sequence[str]], optional
        Blind carbon copy, by default None
    connection : Optional[Any], optional
    attachments : Optional[Sequence[Union[MIMEBase, tuple]]], optional
    headers : Optional[dict[str, str]], optional
    alternatives : Optional[Sequence[Tuple[Any, str]]], optional
    cc : Optional[Sequence[str]], optional
    reply_to : Optional[Sequence[str]], optional

    Raises
    ------
    ValueError
        If an appropriate stream is not set
    """

    def __init__(
        self,
        stream: BroadcastStream,
        template_id: Optional[Union[str, int]] = None,
        template_variables: Optional[TemplateVariables] = None,
        global_template_variables: Optional[TemplateVariables] = None,
        subject: str = "",
        body: str = "",
        from_email: Optional[str] = None,
        to: Optional[Sequence[str]] = None,
        bcc: Optional[Sequence[str]] = None,
        connection: Optional[Any] = None,
        attachments: Optional[Sequence[Union[MIMEBase, tuple]]] = None,
        headers: Optional[dict[str, str]] = None,
        alternatives: Optional[Sequence[Tuple[Any, str]]] = None,
        cc: Optional[Sequence[str]] = None,
        reply_to: Optional[Sequence[str]] = None,
    ) -> None:
        if stream not in BROADCAST_STREAMS:
            raise ValueError(f"Stream must be one of {BROADCAST_STREAMS}")
        super().__init__(
            stream=stream,
            template_id=template_id,
            template_variables=template_variables,
            global_template_variables=global_template_variables,
            subject=subject,
            body=body,
            from_email=from_email,
            to=to,
            bcc=bcc,
            connection=connection,
            attachments=attachments,
            headers=headers,
            alternatives=alternatives,
            cc=cc,
            reply_to=reply_to,
        )
