import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container } from '@material-ui/core';

import { cancelToken } from 'shared/utils';
import { signInUser } from 'shared/api/auth';
import { socketAuthOpen } from 'shared/websocket';
import { clearData } from 'shared/store/defs/actions';
import AuthSchema from 'features/sign-in/model/validator';
import { INITIAL_VALUES } from 'features/sign-in/lib/constants';
import { useSignInModalStyles } from 'features/sign-in/model/use-styles';
import {
  failSignIn,
  startSignIn,
  successSignIn
} from 'shared/store/user/actions';

import Form from './Form';
import Header from './Header';
import Footer from './Footer';

const SignInCancelToken = cancelToken();

const SignInModal = ({
  fail,
  start,
  success,
  clearDefItems
}) => {
  const history = useHistory();
  const classes = useSignInModalStyles();
  const [error, setError] = useState('');

  const handleSubmit = async (
    values,
    { setSubmitting }
  ) => {
    start();

    try {
      const res = await signInUser(values);
      const { authorization } = res;
      success(res, authorization);
      socketAuthOpen();
      history.push('/');
      clearDefItems();
    } catch (e) {
      const { message } = e.response.data;
      fail();
      setError(message);
    }

    setSubmitting(false);
  };

  useEffect(() => {
    return () => {
      SignInCancelToken.cancel();
    };
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Header />

        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={AuthSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form isSubmitting={isSubmitting} />
          )}
        </Formik>

        <Footer error={error} />
      </div>
    </Container>
  );
};

SignInModal.propTypes = {
  start: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired,
  fail: PropTypes.func.isRequired,
  clearDefItems: PropTypes.func.isRequired
};

export default connect(null, dispatch => ({
  start: () => dispatch(startSignIn()),
  success: (user, authorization) =>
    dispatch(successSignIn(user, authorization)),
  fail: () => dispatch(failSignIn()),
  clearDefItems: () => dispatch(clearData())
}))(SignInModal);
