import { connect } from 'react-redux';
import React, { Component } from 'react';

import { compose } from 'shared/utils';
import {
  failSignIn,
  successSignIn
} from 'shared/store/user/actions';

const withData = Cmp => {
  class Wrapper extends Component {
    render() {
      return <Cmp {...this.props} />;
    }
  }

  return compose(
    connect(
      state => ({
        user: state.user.user,
        mapData: state.defs.mapData,
        searchInput: state.search.address
      }),
      dispatch => ({
        fail: () => dispatch(failSignIn()),
        success: (user, authorization) =>
          dispatch(successSignIn(user, authorization))
      })
    )
  )(Wrapper);
};

export default withData;
