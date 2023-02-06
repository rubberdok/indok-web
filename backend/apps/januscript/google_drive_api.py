# from typing import Optional

# from django.conf import settings
# #from googleapiclient.discovery import build


# class GoogleDriveAPI:
#     def __init__(self):
#         self.service = build("drive", "v3", developerKey=settings.GOOGLE_DRIVE_API_KEY)

#     def get_url(self, file_id: str) -> Optional[str]:
#         file = (
#             self.service.files()
#             .get(
#                 fileId=file_id,
#                 fields="id, name, webViewLink",
#                 supportsTeamDrives=True,
#             )
#             .execute()
#         )
#         return file["webViewLink"]

# def get_thumbnail(self, file_id: str) -> Optional[str]:
#     file = (
#         self.service.files()
#         .get(
#             fileId=file_id,
#             fields="id, name, thumbnailLink",
#             supportsTeamDrives=True,
#         )
#         .execute()
#     )
#     return file["thumbnailLink"]
