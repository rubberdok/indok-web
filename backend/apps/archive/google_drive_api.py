from __future__ import print_function

from django.conf import settings
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


# Connect to the Drive v3 API
service = build("drive", "v3", developerKey=settings.GOOGLE_DRIVE_API_KEY)


def get_url(file_id):
    # Call the Drive v3 API
    try:
        file = (
            service.files()
            .get(fileId=file_id, fields="id, name, webViewLink")
            .execute()
        )

    except HttpError as err:
        print(err)
        print("No files found.")
        return None

    return file["webViewLink"]


def get_thumbnail(file_id):
    # No need to call the Drive v3 API
    thumbnail_link = "https://drive.google.com/thumbnail?id=" + file_id
    return thumbnail_link
