import React from 'react';
import { BrowserRouter } from 'react-router-dom';

const withBrowserRouter = Cmp => props => {
  return (
    <BrowserRouter>
      <Cmp {...props} />
    </BrowserRouter>
  );
};

export default withBrowserRouter;
