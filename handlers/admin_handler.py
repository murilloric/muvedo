#!/usr/bin/env python

from google.appengine.ext.webapp import template
from google.appengine.ext import ndb
from google.appengine.datastore.datastore_query import Cursor


import logging
import os.path
import webapp2
import json

from webapp2_extras import auth
from webapp2_extras import sessions

from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError

from models import artist_db


class BaseHandler(webapp2.RequestHandler):
	def display_message(self, message):
		params = {
			'message':message
		}
		self.response.write(json.dumps(params))


class ArtistCursorHandler(BaseHandler):
	def get(self):
		prev = self.request.get('prev', False)
		get_curs = self.request.get('cursor', False)
		try:
			if get_curs:
				curs = Cursor(urlsafe=get_curs)
				last_curs = curs.reversed().urlsafe()
				q_order = artist_db.ArtistProfile.query().order(artist_db.ArtistProfile.date)
			else:
				curs = prev
				last_curs = None
				q_order = artist_db.ArtistProfile.query().order(-artist_db.ArtistProfile.date)
			artist, next_curs, more = q_order.fetch_page(3, start_cursor=curs)
			artist_list = []
			for art in artist:
				artist_list.append(
					dict(user_name = art.user_name) 
					)
			message = dict(last_curs = last_curs, next_curs=next_curs.urlsafe(), artist_list = artist_list)
			self.display_message(message)
		except Exception as e:
			self.display_message(str(e))


