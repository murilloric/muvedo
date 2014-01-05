#!/usr/bin/env python

from google.appengine.ext.webapp import template
from google.appengine.ext import ndb

import logging
import os.path
import webapp2
import json

from webapp2_extras import auth
from webapp2_extras import sessions

from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError

from models import artist_db

def user_required(handler):
  """
    Decorator that checks if there's a user associated with the current session.
    Will also fail if there's no session present.
  """
  def check_login(self, *args, **kwargs):
    auth = self.auth
    logging.info(auth)
    if not auth.get_user_by_session():
      self.redirect('/')
    else:
      return handler(self, *args, **kwargs)

  return check_login

class BaseHandler(webapp2.RequestHandler):
  @webapp2.cached_property
  def auth(self):
    """Shortcut to access the auth instance as a property."""
    return auth.get_auth()

  @webapp2.cached_property
  def user_info(self):
    """Shortcut to access a subset of the user attributes that are stored
    in the session.

    The list of attributes to store in the session is specified in
      config['webapp2_extras.auth']['user_attributes'].
    :returns
      A dictionary with most user information
    """
    return self.auth.get_user_by_session()

  @webapp2.cached_property
  def user(self):
    """Shortcut to access the current logged in user.

    Unlike user_info, it fetches information from the persistence layer and
    returns an instance of the underlying model.

    :returns
      The instance of the user model associated to the logged in user.
    """
    u = self.user_info
    return self.user_model.get_by_id(u['user_id']) if u else None

  @webapp2.cached_property
  def user_model(self):
    """Returns the implementation of the user model.

    It is consistent with config['webapp2_extras.auth']['user_model'], if set.
    """    
    return self.auth.store.user_model

  @webapp2.cached_property
  def session(self):
      """Shortcut to access the current session."""
      return self.session_store.get_session(backend="datastore")

  def render_template(self, view_filename, params=None):
    if not params:
      params = {}
    user = self.user_info
    params['user'] = user
    path = os.path.join(os.path.dirname(__file__), 'views', view_filename)
    self.response.out.write(template.render(path, params))

  def display_message(self, message):
    params = {
      'message': message
    }
    self.response.write(json.dumps(params))

  # this is needed for webapp2 sessions to work
  def dispatch(self):
      # Get a session store for this request.
      self.session_store = sessions.get_store(request=self.request)

      try:
          # Dispatch the request.
          webapp2.RequestHandler.dispatch(self)
      finally:
          # Save all sessions.
          self.session_store.save_sessions(self.response)

class CheckUserHandler(BaseHandler):
  def get(self):
    is_user = self.user
    logging.info(is_user)
    if is_user:
      user_name = dict(user_name = is_user.user_name, user_id = self.user_info['user_id'])
    else:
      user_name = 'no'

    # self.response.write(self.user_info['user_id'])

    self.display_message(user_name)

class JoinHandler(BaseHandler):
  def post(self):
    obj = json.loads(self.request.body)
    name = obj['name']
    user_name = name.replace(' ', '-').lower()
    email = obj['email']
    member_type = obj['member_type']
    password = obj['password']

    unique_properties = ['name', 'user_name']
    user_data = self.user_model.create_user(email, unique_properties, member_type=member_type, email_address=email, user_name=user_name, name=name, password_raw=password, verified=False)
    if not user_data[0]: #user_data is a tuple
      self.display_message(user_data[1])
      return

    else:
      user = user_data[1]
      user_id = user.get_id()
      add = artist_db.ArtistProfile(
        user_id = str(user_id),
        user_name = user_name,
        name = name,
        avatar ='none',
        bio = 'bio',
        category = 'category'
      )
      add.put()
      add_social_links = artist_db.ArtistSocialLinks(
        user_id = str(user_id),
        user_name = user_name,
        audio_links = [],
        video_links = [],
        image_links = [],
        text_links = []
      )
      add_social_links.put()
      token = self.user_model.create_signup_token(user_id)

      # verification_url = self.uri_for('verification', type='v', user_id=user_id,
      #   signup_token=token, _full=True)

      self.display_message(True)

class ForgotPasswordHandler(BaseHandler):
  def get(self):
    self._serve_page()

  def post(self):
    obj = json.loads(self.request.body)
    username = obj['username']
    user = self.user_model.get_by_auth_id(username)

    if not user:
      logging.info('Could not find any user entry for username %s', username)
      self.display_message('Could not find any user entry for username %s', username)
      return

    user_id = user.get_id()
    token = self.user_model.create_signup_token(user_id)

    verification_url = self.uri_for('verification', type='p', user_id=user_id,
      signup_token=token, _full=True)

    msg = 'Send an email to user in order to reset their password. \
          They will be able to do so by visiting <a href="{url}">{url}</a>'

    self.display_message(msg.format(url=verification_url))


class VerificationHandler(BaseHandler):
  def get(self, *args, **kwargs):
    user = None
    user_id = kwargs['user_id']
    signup_token = kwargs['signup_token']
    verification_type = kwargs['type']

    # it should be something more concise like
    # self.auth.get_user_by_token(user_id, signup_token
    # unfortunately the auth interface does not (yet) allow to manipulate
    # signup tokens concisely
    user, ts = self.user_model.get_by_auth_token(int(user_id), signup_token,
      'signup')

    if not user:
      logging.info('Could not find any user with id "%s" signup token "%s"',
        user_id, signup_token)
      self.abort(404)
    
    # store user data in the session
    self.auth.set_session(self.auth.store.user_to_dict(user), remember=True)

    if verification_type == 'v':
      # remove signup token, we don't want users to come back with an old link
      self.user_model.delete_signup_token(user.get_id(), signup_token)

      if not user.verified:
        user.verified = True
        user.put()

      self.display_message('User email address has been verified.')
      return
    elif verification_type == 'p':
      # supply user to the page
      params = {
        'user': user,
        'token': signup_token
      }
      self.render_template('resetpassword.html', params)
    else:
      logging.info('verification type not supported')
      self.abort(404)

class SetPasswordHandler(BaseHandler):

  @user_required
  def post(self):
    obj = json.loads(self.request.body)
    password = obj['password']
    old_token = obj['t']

    if not password or password != self.request.get('confirm_password'):
      self.display_message('passwords do not match')
      return

    user = self.user
    user.set_password(password)
    user.put()

    # remove signup token, we don't want users to come back with an old link
    self.user_model.delete_signup_token(user.get_id(), old_token)
    
    self.display_message('Password updated')

class LoginMemberHandler(BaseHandler):
  def post(self):
    obj = json.loads(self.request.body)
    logging.info(obj)
    username = obj['username']
    password = obj['password']
    try:
      u = self.auth.get_user_by_password(username, password, remember=True,
        save_session=True)
      user = self.user_model.get_by_auth_id(username)
      logging.info(user)
      post_back = dict(path=user.member_type, username=user.user_name)
      self.display_message(post_back)
    except (InvalidAuthIdError, InvalidPasswordError) as e:
      logging.info('Login failed for user %s because of %s', username, type(e))
      self.display_message(False)

class LogoutMemberhandler(BaseHandler):
  def get(self):
    self.auth.unset_session()
    self.redirect('/')

class RedirectUser(BaseHandler):
  def get(self):
    is_user = self.user
    if is_user:
      self.redirect('/app/index.html#/artist/'+ is_user.user_name)
    else:
      self.redirect('/')



class AuthenticatedHandler(BaseHandler):
  @user_required
  def get(self):
    self.render_template('authenticated.html')
