""" from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request """

""" # If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']

def main():
    #fileID):
    Shows basic usage of the Drive v3 API.
    Prints the names and ids of the first 10 files the user has access to.
   
    creds = None
    # The file token.pickle stores the user's accesss and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('apps/archive/token.pickle'):
        with open('apps/archive/token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'apps/archive/credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('apps/archive/token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('drive', 'v3', credentials=creds)
    return service

            
def get_url(file_id):
    service = main()     
    # Call the Drive v3 API

    try:
        file = service.files().get(fileId=file_id,fields ="id, name, webViewLink").execute()
    except HTTPError as err:
        print('No files found.')
        pass
    
    return file['webViewLink']


def get_thumbNail(file_id):
    # No need to call the Drive v3 API
    thumbnail_link = "https://drive.google.com/thumbnail?id=" + file_id
    return thumbnail_link



if __name__ == '__main__':
    main()
 """

   