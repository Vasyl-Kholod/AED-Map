import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import { cancelToken } from 'shared/utils';
import { signInUser } from 'shared/api/auth';
import { socketAuthOpen } from 'shared/websocket';
import AuthSchema from 'features/sign-in/model/validator';
import { INITIAL_VALUES } from 'features/sign-in/lib/constants';
import { useSignInModalStyles } from 'features/sign-in/model/use-styles';
import {
  failSignIn,
  startSignIn,
  successSignIn
} from 'shared/store/user/actions';
import {
  fetchDefs,
  clearData
} from 'modules/Sidebar/components/ItemList/actions/list';

import Form from './Form';
import Header from './Header';
import Footer from './Footer';

const SignInCancelToken = cancelToken();

const SignInModal = ({
  start,
  success,
  fail,
  fetchDefItems,
  clearDefItems
}) => {
  const classes = useSignInModalStyles();
  const [error, setError] = useState('');

  const handleSubmit = async (
    values,
    { setSubmitting }
  ) => {
    start();

    try {
      const { data, headers } = await signInUser(values);
      const { authorization } = headers;
      success(data, authorization);
      socketAuthOpen();
      clearDefItems();
      fetchDefItems();
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
  fetchDefItems: PropTypes.func.isRequired,
  clearDefItems: PropTypes.func.isRequired
};

export default connect(null, dispatch => ({
  start: () => dispatch(startSignIn()),
  success: (user, authorization) =>
    dispatch(successSignIn(user, authorization)),
  fail: () => dispatch(failSignIn()),
  fetchDefItems: () => dispatch(fetchDefs()),
  clearDefItems: () => dispatch(clearData())
}))(SignInModal);
