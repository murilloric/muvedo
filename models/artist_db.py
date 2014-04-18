from google.appengine.ext import db
import time
import webapp2_extras.appengine.auth.models

from google.appengine.ext import ndb

from webapp2_extras import security




class ArtistProfile(ndb.Model):
  user_id = ndb.StringProperty()
  user_name = ndb.StringProperty()
  name = ndb.StringProperty()
  avatar = ndb.StringProperty()
  bio = ndb.TextProperty()
  category = ndb.StringProperty()
  social_links = ndb.StringProperty()
  tintup_feed = ndb.TextProperty()
  date = ndb.DateTimeProperty(auto_now_add=True)

  @classmethod
  def query_profile(cls, ancestor_key):
    return cls.query(ancestor=ancestor_key).order(-cls.date)


class ArtistSocialLinks(ndb.Model):
  user_id = ndb.StringProperty()
  user_name = ndb.StringProperty()
  audio_links = ndb.JsonProperty()
  video_links = ndb.JsonProperty()
  image_links = ndb.JsonProperty()
  text_links = ndb.JsonProperty()

