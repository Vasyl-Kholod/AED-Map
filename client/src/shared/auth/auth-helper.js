import axios from 'axios';
import { includes } from 'lodash';

// import { isTokenExpired } from 'next/app/auth/common/token';
import {
  AUTH_EVENTS,
  ACCESS_TOKEN_STORAGE_KEY,
  CURRENT_USER_STORAGE_KEY
} from './types';

class AuthHelper {
  constructor(authModule) {
    this._authModule = authModule;
    this._tokenPromise = null;
  }

  get authModule() {
    return this._authModule;
  }

  getToken = () =>
    localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  removeToken = () =>
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);

  setToken = token =>
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);

  getCurrentUser = () =>
    JSON.parse(
      localStorage.getItem(CURRENT_USER_STORAGE_KEY)
    );

  removeCurrentUser = () =>
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);

  setCurrentUser = currentUser =>
    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      JSON.stringify(currentUser)
    );

  removeCurrentAuthenticatedUser = () => {
    this.removeCurrentUser();
    this.authModule.authHUB.publish(
      AUTH_EVENTS.CHANGED_AUTHENTICATED_USER
    );
  };

  getJWTTokenConfig = async config => {
    try {
      const token = await this.getJWTToken(config);
      this._tokenPromise = null;
      return {
        ...(token && { Authorization: `JWT ${token}` })
      };
    } catch {
      this._tokenPromise = null;
      return {};
    }
  };

  getTransformedConfig = async config => ({
    ...config,
    headers: {
      ...config.headers,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      ...(await this.getJWTTokenConfig(config))
    }
  });

  prepareRequestsConfig = async config => {
    try {
      return this.getTransformedConfig(config);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  handleResponseOfRequest = error => {
    const blockedCodes = [401, 403];

    if (error && error.response) {
      const errorResponse = error.response;

      if (includes(blockedCodes, errorResponse.status)) {
        this.authModule.signOut();
      }
    }

    return Promise.reject(error);
  };

  configureAxiosClient = (
    { baseUrl },
    httpClient = axios
  ) => {
    httpClient.defaults.baseURL = baseUrl;

    httpClient.interceptors.request.use(
      this.prepareRequestsConfig
    );

    httpClient.interceptors.response.use(
      oResponse => oResponse,
      this.handleResponseOfRequest
    );
  };

  getJWTTokenPromise = async () => {
    const token = this.getToken();

    if (token) {
      // TODO
      const [err, isExpired] = isTokenExpired(token, {
        clockTolerance: 30
      });

      if (err || isExpired) {
        this.authModule.signOut();
        return Promise.resolve();
      }
      return token;
    }

    return null;
  };

  getJWTToken = async (...params) => {
    if (!this._tokenPromise) {
      this._tokenPromise = await this.getJWTTokenPromise(
        ...params
      );
    }
    return this._tokenPromise;
  };
}

export default AuthHelper;
