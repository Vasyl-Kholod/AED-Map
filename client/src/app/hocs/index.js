import { withRouter } from 'react-router-dom';
import { compose } from 'shared/utils';

import withData from './with-data';
import withStore from './with-store';
import withBrowserRouter from './with-router';

export const withHocs = compose(
  withStore,
  withBrowserRouter,
  withRouter,
  withData
);
