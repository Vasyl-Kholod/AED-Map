import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';

import { useRefetchDefsList } from 'features/defs-list/model/use-get-defs';
import { socketAuthClose } from 'shared/websocket';
import { signOut } from 'shared/store/user/actions';
import { useButtonSignOutStyles } from 'features/sign-in/model/use-styles';

import ConfirmationModalWrapper from 'shared/ui/ConfirmationModalWrapper';

const CustomButton = ({ handleOpen }) => {
  const classes = useButtonSignOutStyles();

  return (
    <Button
      className={classes.button}
      variant="contained"
      color="primary"
      onClick={handleOpen}
    >
      Вийти з особистого кабінету
    </Button>
  );
};

CustomButton.propTypes = {
  handleOpen: PropTypes.func.isRequired
};

const ButtonSignOut = ({
  signOutSubmit
}) => {
  const refetchDefsList = useRefetchDefsList();

  const handleSignOut = () => {
    signOutSubmit();
    socketAuthClose();
    refetchDefsList();
  };

  return (
    <ConfirmationModalWrapper
      ButtonOpen={CustomButton}
      confirmHandle={handleSignOut}
      message="Дійсно бажаєте вийти з особистого кабінету?"
      messageAlert="Вихід успішно здійснено"
    />
  );
};

ButtonSignOut.propTypes = {
  signOutSubmit: PropTypes.func.isRequired,
  clearDefItems: PropTypes.func.isRequired
};

export default connect(null, dispatch => ({
  signOutSubmit: () => dispatch(signOut())
}))(ButtonSignOut);
