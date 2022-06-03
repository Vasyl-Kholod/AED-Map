const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const CURRENT_USER_STORAGE_KEY = 'currentUser';

const AUTH_EVENTS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  SUCCESSFULLY_SIGN_IN: 'SUCCESSFULLY_SIGN_IN',
  SUCCESSFULLY_SIGN_OUT: 'SUCCESSFULLY_SIGN_OUT',
  CHANGED_AUTHENTICATED_USER: 'CHANGE_AUTHENTICATED_USER'
};

const URL_ENUM = {
  LOGOUT: '/api/auth/logout/',
  CURRENT_USER: '/api/auth/self/',
  LOGIN: '/api/auth/passswd_login/',
  REFRESH: '/api/auth/token_refresh/',
  SUPPORTED_VERSIONS:
    '/django-static/desktop_install/info.json'
};

export {
  URL_ENUM,
  AUTH_EVENTS,
  ACCESS_TOKEN_STORAGE_KEY,
  CURRENT_USER_STORAGE_KEY
};
