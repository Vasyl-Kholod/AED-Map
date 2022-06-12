import React from 'react';
import { useEffect, createContext } from 'react';

import { authProvider } from 'shared/auth';

const AuthContext = createContext();

const withConfiguredAuth = Cmp => props => {
  const oConfig = {
    baseUrl:
      process.env.REACT_APP_BASE_URL ||
      'http://localhost:3012'
  };

  useEffect(() => {
    authProvider.configure(oConfig);
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
