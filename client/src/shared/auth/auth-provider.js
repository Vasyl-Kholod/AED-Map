import authModule from './auth';

class AuthProvider {
  constructor() {
    this._auth = authModule;
  }

  get auth() {
    return this._auth;
  }

  get signIn() {
    return this.auth.signIn;
  }

  get signOut() {
    return this.auth.signOut;
  }

  get configure() {
    return this.auth.configure;
  }

  get getJWTToken() {
    return this.auth.getJWTToken;
  }

  get getCurrentAuthenticatedUser() {
    return this.auth.getCurrentUser;
  }

  onAuthStateChange = (eventType, callback) =>
    this.auth.authHUB.subscribe(eventType, callback);
}

const authProvider = new AuthProvider();

export { authProvider };

export default AuthProvider;
