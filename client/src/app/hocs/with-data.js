import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'shared/utils';

import {
  failSignIn,
  successSignIn
} from 'modules/Auth/actions/user';
import { setActive } from 'modules/Sidebar/components/ItemList/actions/list';

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
          dispatch(successSignIn(user, authorization)),
        makeItemActive: itemId =>
          dispatch(setActive(itemId))
      })
    )
  )(Wrapper);
};

export default withData;
