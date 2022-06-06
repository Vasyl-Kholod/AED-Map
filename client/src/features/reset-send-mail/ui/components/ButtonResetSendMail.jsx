import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

const ButtonResetSendMail = ({ handleOpen }) => (
  <Button color="primary" onClick={handleOpen}>
    Відновити пароль
  </Button>
);

ButtonResetSendMail.propTypes = {
  handleOpen: PropTypes.func.isRequired
};

export default ButtonResetSendMail;
