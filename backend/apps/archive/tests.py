from unittest.mock import patch

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from apps.archive.models import ArchiveDocument
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.users import UserFactory


def _mock_drive(mock_drive_cls):
    mock_drive_cls.return_value.get_url.return_value = "https://drive.example/doc"
    mock_drive_cls.return_value.get_thumbnail.return_value = None


class ArchiveMutationsTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.user = UserFactory()
        self.super_user = UserFactory(is_staff=True, is_superuser=True)

        with patch("apps.archive.models.GoogleDriveAPI") as mock_drive_cls:
            _mock_drive(mock_drive_cls)
            self.document = ArchiveDocument.objects.create(
                title="Existing document",
                type_doc="Annet",
                file_location="existing-file-id",
            )

    def add_archive_permission(self, codename):
        content_type = ContentType.objects.get_for_model(ArchiveDocument)
        self.user.user_permissions.add(
            Permission.objects.get(codename=codename, content_type=content_type)
        )

    def create_document(self, user=None):
        query = """
            mutation {
              createArchivedocument(
                title: "New document",
                date: "2026-01-01T00:00:00+00:00",
                typeDoc: "Annet",
                fileLocation: "new-file-id",
              ) {
                ok
              }
            }
        """
        with patch("apps.archive.models.GoogleDriveAPI") as mock_drive_cls:
            _mock_drive(mock_drive_cls)
            return self.query(query, user=user)

    def update_document(self, title, user=None):
        query = f"""
            mutation {{
              updateArchivedocument(
                id: "{self.document.id}",
                title: "{title}",
              ) {{
                ok
              }}
            }}
        """
        return self.query(query, user=user)

    def delete_document(self, user=None):
        query = f"""
            mutation {{
              deleteArchivedocument(id: "{self.document.id}") {{
                ok
              }}
            }}
        """
        return self.query(query, user=user)

    def test_create_requires_permission(self):
        response = self.create_document(user=None)
        self.assert_permission_error(response)

        response = self.create_document(user=self.user)
        self.assert_permission_error(response)

        self.assertEqual(ArchiveDocument.objects.count(), 1)

    def test_create_with_permission(self):
        self.add_archive_permission("add_archivedocument")
        response = self.create_document(user=self.user)
        self.assertResponseNoErrors(response)
        created = ArchiveDocument.objects.get(title="New document")
        self.assertEqual(created.year, 2026)
        self.assertEqual(created.type_doc, "Annet")
        self.assertEqual(created.file_location, "new-file-id")

    def test_update_requires_permission(self):
        response = self.update_document("Hacked title", user=None)
        self.assert_permission_error(response)

        response = self.update_document("Hacked title", user=self.user)
        self.assert_permission_error(response)

        self.document.refresh_from_db()
        self.assertEqual(self.document.title, "Existing document")

    def test_update_persists_changes(self):
        self.add_archive_permission("change_archivedocument")
        response = self.update_document("Updated title", user=self.user)
        self.assertResponseNoErrors(response)

        # Regression: UpdateArchiveDocument used to modify the object without saving
        self.document.refresh_from_db()
        self.assertEqual(self.document.title, "Updated title")

    def test_update_persists_remaining_fields(self):
        self.add_archive_permission("change_archivedocument")
        query = f"""
            mutation {{
              updateArchivedocument(
                id: "{self.document.id}",
                date: "2024-06-15T00:00:00+00:00",
                typeDoc: "Januscript",
                fileLocation: "updated-file-id",
                webLink: "https://drive.example/updated",
              ) {{
                ok
              }}
            }}
        """
        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)

        self.document.refresh_from_db()
        self.assertEqual(self.document.year, 2024)
        self.assertEqual(self.document.type_doc, "Januscript")
        self.assertEqual(self.document.file_location, "updated-file-id")
        self.assertEqual(self.document.web_link, "https://drive.example/updated")

    def test_delete_requires_permission(self):
        response = self.delete_document(user=None)
        self.assert_permission_error(response)

        response = self.delete_document(user=self.user)
        self.assert_permission_error(response)

        self.assertTrue(ArchiveDocument.objects.filter(pk=self.document.pk).exists())

    def test_delete_with_permission(self):
        self.add_archive_permission("delete_archivedocument")
        response = self.delete_document(user=self.user)
        self.assertResponseNoErrors(response)
        self.assertFalse(ArchiveDocument.objects.filter(pk=self.document.pk).exists())
