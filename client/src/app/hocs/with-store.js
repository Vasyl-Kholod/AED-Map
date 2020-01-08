import React from 'react';
import { Provider } from 'react-redux';
import store from 'shared/store';

const withStore = Cmp => props => {
  return (
    <Provider store={store}>
      <Cmp {...props} />
    </Provider>
  );
};

export default withStore;
