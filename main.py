#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import logging
import webapp2
import json
from models import model, artist_db
from handlers import accesscontrol, artist_handler , mediabrain

class MainHandler(webapp2.RequestHandler):
  def get(self, *args, **kwargs):
    route = self.request.path.split('/')[1]
    if route:
      qry = artist_db.ArtistProfile.query(artist_db.ArtistProfile.user_name == route).get()
      if qry:
        self.redirect('/app/index.html#/artist/'+ qry.user_name)
      else:
        self.redirect('/app/index.html#/home/')
    else:
      self.redirect('/app/index.html#/home/')

class ContactHandler(webapp2.RequestHandler):
	def post(self):
		data = json.loads(self.request.body)
		artist_name = data['artist_name']
		artist_bio = data['artist_bio']
		facebook = data['facebook']
		twitter = data['twitter']
		instagram = data['instagram']
		youtube = data['youtube']
		add_contact = model.Contact(artist_name=artist_name, artist_bio=artist_bio, facebook=facebook, twitter=twitter, instagram=instagram, youtube=youtube)
		add_contact.put()
		self.response.write('thanks %s for submitting your info' %(artist_name))

config = {
  'webapp2_extras.auth': {
    'user_model': 'models.model.User',
    'user_attributes': ['name']
  },
  'webapp2_extras.sessions': {
    'secret_key': 'muvedo-is-art-09-2007'
  }
}

app = webapp2.WSGIApplication([
    ('/contact', ContactHandler),
    #access control
    ('/accesscontrol/join', accesscontrol.JoinHandler),
    ('/accesscontrol/loginmember', accesscontrol.LoginMemberHandler),
    ('/accesscontrol/logoutmember', accesscontrol.LogoutMemberhandler),
    ('/accesscontrol/checkuser', accesscontrol.CheckUserHandler),
    ('/accesscontrol/redirectuser', accesscontrol.RedirectUser),
    #end access controll

    #artist core
    ('/artist/crud', artist_handler.ArtistCrud),
    #end artist core

    # media  brain
    ('/media/getuploadurl', mediabrain.MediaUrl),
    ('/media/upload', mediabrain.MediaUpload),
    (r'/media/cdn/(.*)', mediabrain.MediaCDN),
    ('/media/deletefile', mediabrain.MediaDelete),
    # end media brain
    (r'/(.*)', MainHandler),
], debug=True, config=config)
