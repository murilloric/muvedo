import webapp2
import json
import logging
from models import model, artist_db
from handlers import accesscontrol

from google.appengine.ext import ndb

class BaseHandler(webapp2.RequestHandler):
	def display_message(self, message):
		params = {
			'message':message
		}
		self.response.write(json.dumps(params))

	def load_json(self, data):
		obj = json.loads(data)
		return obj

	def get_entity(self, key):
		entity = artist_db.ArtistProfile.query(artist_db.ArtistProfile.user_id == str(key)).get()
		return entity

	def get_social_links(self, key):
		social_links = artist_db.ArtistSocialLinks.query(artist_db.ArtistSocialLinks.user_id == str(key)).get()
		return social_links

	def review_entity(self, key):
		logging.info(key)
		entity = artist_db.ArtistProfile.query(artist_db.ArtistProfile.user_name == str(key)).get()
		social_links = artist_db.ArtistSocialLinks.query(artist_db.ArtistSocialLinks.user_name == key).get()
		return dict(entity=entity, social_links=social_links)

	def create_data(self, data):
		data = data
		add = artist_db.ArtistProfile(
			name = data['name'],
			avatar = data['avatar'],
			bio = data['bio'],
			category = data['category']
		)
		add.put()

		artist_key = add.key.urlsafe()
		return artist_key

	def update_data(self, key, data):
		data = data
		logging.info('update key')
		logging.info(key)
		update_entity = self.get_entity(key)
		logging.info(update_entity)
		update_entity.name  = data['name']
		update_entity.avatar = data['avatar']
		update_entity.bio = data['bio']
		update_entity.category = data['category']
		update_entity.put()

		update_social_links = self.get_social_links(key)
		update_social_links.audio_links = data['audio_links']
		update_social_links.video_links = data['video_links']
		update_social_links.image_links = data['image_links']
		update_social_links.text_links = data['text_links']
		update_social_links.put()
		return data

	def review_data(self, key):
		q = self.review_entity(key)
		logging.info(q)
		obj = dict(name = q['entity'].name, avatar = q['entity'].avatar, bio = q['entity'].bio, category = q['entity'].category, 
			audio_links = q['social_links'].audio_links,
			video_links = q['social_links'].video_links,
			image_links = q['social_links'].image_links,
			text_links = q['social_links'].text_links
			)
		return obj

	def delete_data(self, key, data):
		entity = self.get_entity(key)
		logging.info(entity)
		entity.key.delete()
		data = data
		return data



class ArtistCrud(BaseHandler):
	def post(self):
		obj = self.load_json(self.request.body)
		crud = obj['crud']
		data = obj['data']
		key = obj['key']
		if crud == 'create':
			message = self.create_data(data)
		elif crud == 'review':
			message = self.review_data(key)
		elif crud == 'update':
			message = self.update_data(key, data)
		elif crud == 'delete':
			message = self.delete_data(key, data)
		else:
			message = False

		self.display_message(message)

