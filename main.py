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
from models import model
from handlers import accesscontrol, artist_handler , mediabrain

class MainHandler(webapp2.RequestHandler):
  def get(self):
    is_user = accesscontrol.BaseHandler().user
    if is_user:
      self.redirect('/app/index.html#/artist/'+ is_user.user_name)
    else:
      self.redirect('/app/index.html#/')

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
    'secret_key': 'YOUR_SECRET_KEY'
  }
}

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/contact', ContactHandler),
    #access control
    ('/accesscontrol/join', accesscontrol.JoinHandler),
    ('/accesscontrol/loginmember', accesscontrol.LoginMemberHandler),
    ('/accesscontrol/logoutmember', accesscontrol.LogoutMemberhandler),
    ('/accesscontrol/checkuser', accesscontrol.CheckUserHandler),
    #end access controll

    #artist core
    ('/artist/crud', artist_handler.ArtistCrud),
    #end artist core

    # media  brain
    ('/media/getuploadurl', mediabrain.MediaUrl),
    ('/media/upload', mediabrain.MediaUpload),
    (r'/media/cdn/(.*)', mediabrain.MediaCDN),
    ('/media/deletefile', mediabrain.MediaDelete)
    # end media brain
], debug=True, config=config)
