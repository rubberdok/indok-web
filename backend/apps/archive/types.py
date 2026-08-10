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
        fallback_thumbnail = (
            f"https://drive.google.com/thumbnail?authuser=0&sz=w320&id={instance.file_location}"
        )

        if not instance.thumbnail:
            return fallback_thumbnail

        if "googleusercontent.com/drive-storage/" in instance.thumbnail:
            return fallback_thumbnail

        return instance.thumbnail
