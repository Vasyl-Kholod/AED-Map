import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import { SIGNUP } from 'shared/store/user/constants';
import checkPermission from 'shared/utils/permission';

import ButtonBack from 'shared/ui/ButtonBack';
import { ButtonSignOut } from 'features/sign-in';
import { SignUpSendMail } from 'features/sign-up-send-mail';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  }
});

const Account = ({ user }) => {
  const classes = useStyles();
  const [
    permissionForSignUp,
    changePermissionForSignUp
  ] = useState(false);

  useEffect(() => {
    const permissionSignUp = checkPermission(SIGNUP, user);
    changePermissionForSignUp(permissionSignUp);
  }, [user]);

  return (
    <div className={classes.container}>
      {permissionForSignUp && <SignUpSendMail />}
      <ButtonSignOut />
      <ButtonBack />
    </div>
  );
};

Account.defaultProps = {
  user: null
};

Account.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  })
};

export default connect(state => ({
  user: state.user.user
}))(Account);
