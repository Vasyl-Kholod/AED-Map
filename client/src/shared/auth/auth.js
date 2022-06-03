import axios from 'axios';
import { get } from 'lodash';

import authHUB from './auth-hub';
import AuthHelper from './auth-helper';
import { AUTH_EVENTS, URL_ENUM } from './types';

class Auth {
  get authHUB() {
    return this._authHUB;
  }

  get authHelper() {
    return this._authHelper;
  }

  get httpClient() {
    return this._httpClient;
  }

  get getJWTToken() {
    return this.authHelper.getJWTToken;
  }

  get getCurrentUser() {
    return this.authHelper.getCurrentUser;
  }

  constructor() {
    this._authHUB = authHUB;
    this._authHelper = new AuthHelper(this);
  }

  configure = oConfig => {
    this.authHelper.configureAxiosClient(oConfig);

    this._httpClient = axios.create();
    this.authHelper.configureAxiosClient(
      oConfig,
      this.httpClient
    );
  };

  getCurrentAuthenticatedUser = async () => {
    this.authHelper.setCurrentUser(
      await this.httpClient.get(URL_ENUM.CURRENT_USER)
    );

    this.authHUB.publish(
      AUTH_EVENTS.CHANGED_AUTHENTICATED_USER
    );

    return this.authHelper.getCurrentUser();
  };

  signIn = async oCredentials => {
    this.authHUB.publish(AUTH_EVENTS.SIGN_IN);
    const oResponse = await this.httpClient.post(
      URL_ENUM.LOGIN,
      oCredentials,
      {
        urlParams: {
          profileId: 1
        }
      }
    );
    const newToken = get(oResponse, 'access_token', null);
    this.authHelper.setToken(newToken);

    await this.getCurrentAuthenticatedUser();
    await this.authHelper.getSupportedVersions();

    this.authHUB.publish(
      AUTH_EVENTS.SUCCESSFULLY_SIGN_IN,
      newToken
    );
  };

  signOut = async () => {
    this.authHUB.publish(AUTH_EVENTS.SIGN_OUT);
    this.authHelper.removeToken();
    this.authHelper.removeCurrentAuthenticatedUser();
    this.authHUB.publish(AUTH_EVENTS.SUCCESSFULLY_SIGN_OUT);
  };
}

const authModule = new Auth();

export { authModule, Auth };

export default authModule;
