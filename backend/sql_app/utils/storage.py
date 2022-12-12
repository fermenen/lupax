import os
from google.cloud import storage
import datetime
from google.auth import compute_engine

class StorageCloud(object):
    
    credentials = compute_engine.Credentials()

    storage_client = storage.Client(credentials=credentials)

    def get_bucket(self, bucket=os.environ.get('BUCKET')):
        return self.storage_client.bucket(bucket)

    def upload_file(self, file, destination, bucket=os.environ.get('BUCKET')):
        blob = self.get_bucket(bucket).blob(destination)
        blob.upload_from_filename(file)

    def get_temporary_url(self, file, minutes=40, bucket=os.environ.get('BUCKET')):
        bucket = self.get_bucket(bucket)
        blob = bucket.blob(file)
        url = blob.generate_signed_url(
            version="v4", expiration=datetime.timedelta(minutes=minutes), method="GET")
        return url
