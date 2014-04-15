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

from webapp2_extras import jinja2
import webapp2
import json
import os
from models import model, artist_db
from handlers import accesscontrol, artist_handler , mediabrain, admin_handler

# JINJA_ENVIRONMENT = jinja2.Environment(
#     loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
#     extensions=['jinja2.ext.autoescape'],
#     autoescape=False)

jinja2.default_config['template_path'] = os.path.join(
    os.path.dirname(__file__),
    'html'
)


if not jinja2.default_config['environment_args']:
    jinja2.default_config['environment_args'] = {}


jinja2.default_config['environment_args'].update(dict(
    # need to not collide with angular template syntax
    variable_start_string="{!",
    variable_end_string="!}"
))



class ArtistRouter(webapp2.RequestHandler):
    def get(self, artist):
        logging.info(artist)
        qry = artist_db.ArtistProfile.query(artist_db.ArtistProfile.user_name == artist).get()
        if qry:
            j2 = jinja2.get_jinja2()
            template = j2.render_template('artist.html')
            self.response.write(template)
        else:
            self.redirect('/')

class MainHandler(webapp2.RequestHandler):
  def get(self, *args, **kwargs):
    j2 = jinja2.get_jinja2()
    template = j2.render_template('index.html')
    self.response.write(template)
    # route = self.request.path.split('/')[1]
    # if route:
    #   qry = artist_db.ArtistProfile.query(artist_db.ArtistProfile.user_name == route).get()
    #   if qry:
    #     self.redirect('/app/index.html#/artist/'+ qry.user_name)
    #   else:
    #     self.redirect('/app/index.html#/home/')
    # else:
    #   self.redirect('/app/index.html#/home/')

# class NewAppHandler(webapp2.RequestHandler):
#     def get(self):
#         with open(os.path.join(os.path.dirname(__file__), 'html_templates',
#             'app_dir', 'index.html')) as f:
#             data = f.read()
#             self.response.write(data)


class AdminHandler(webapp2.RequestHandler):
  def get(self):
    self.redirect('/admin/index.html#/home')

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

# class ArtistCursorHandler(webapp2.RequestHandler):
#   def get(self):
#     self.response.write('hey')



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
    ('/admin', AdminHandler),
    ('/admindata/getartist', admin_handler.ArtistCursorHandler),
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
    (r'/artist/(.*)', ArtistRouter),
    ('/', MainHandler),
], debug=True, config=config)
