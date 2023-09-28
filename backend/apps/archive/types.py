from typing import Optional

import graphene
from graphene_django import DjangoObjectType

from .models import ArchiveDocument


class ArchiveDocumentType(DjangoObjectType):
    thumbnail = graphene.String()

    class Meta:
        model = ArchiveDocument

    @staticmethod
    def resolve_thumbnail(instance: ArchiveDocument, info) -> Optional[str]:
        return f"https://drive.google.com/thumbnail?authuser=0&sz=w320&id={instance.file_location}"
