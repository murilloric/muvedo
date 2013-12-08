import logging
from models import model, artist_db
from handlers import accesscontrol

from google.appengine.ext import ndb

import logging
import json
import webapp2
import urllib
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext import db, webapp
from google.appengine.ext.webapp import util
from google.appengine.api import urlfetch
from google.appengine.api import users
from google.appengine.ext import db, blobstore
from google.appengine.ext import ndb


def display_message(self, status, data):
  params = {
    'status': status,
    'data': data
  }
  self.response.write(json.dumps(params))


class MediaDelete(webapp2.RequestHandler):
  def get(self):
    blob_key = self.request.get('blob_key')
    blobstore.delete(blob_key)
    status = 'success'
    data = 'key :' + blob_key
    display_message(self, status, data)



class MediaUpload(blobstore_handlers.BlobstoreUploadHandler):
  def post(self):
    upload_files = self.get_uploads()
    blob_info = upload_files[0]
    logging.info(upload_files)
    status = 'success'
    data = '/media/cdn/' + str(blob_info.key())
    display_message(self, status, data)


class MediaCDN(blobstore_handlers.BlobstoreDownloadHandler):
  def get(self, resource):
    resource = str(urllib.unquote(resource))
    blob_info = blobstore.BlobInfo.get(resource)
    self.send_blob(blob_info)


class MediaUrl(webapp2.RequestHandler):
  def get(self):
    upload_url = blobstore.create_upload_url('/media/upload')
    status = 'success'
    data = upload_url
    display_message(self, status, data)


