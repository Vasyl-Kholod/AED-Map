import { useEffect, createContext } from 'react';

import { authProvider } from 'shared/auth';

const AuthContext = createContext();

const withConfiguredAuth = Cmp => props => {
  useEffect(() => {
    // {baseUrl: 'api.aed-map.pp.ua'}
    authProvider.configure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={authProvider}>
      <Cmp {...props} />
    </AuthContext.Provider>
  );
};

export { AuthContext };

export default withConfiguredAuth;
