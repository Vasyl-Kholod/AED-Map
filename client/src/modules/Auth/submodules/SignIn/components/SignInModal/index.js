import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { cancelToken } from 'shared/utils';
import { socketAuthOpen } from 'shared/websocket';

import AuthSchema from './validator';
import { INITIAL_VALUES } from './const';
import { signInUser } from '../../../../api';
import {
  startSignIn,
  successSignIn,
  failSignIn
} from '../../../../actions/user';
import {
  fetchDefs,
  clearData
} from '../../../../../Sidebar/components/ItemList/actions/list';

import Form from './components/Form';
import Header from './components/Header';
import Footer from './components/Footer';

const SignInCancelToken = cancelToken();

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

const SignInModal = ({
  start,
  success,
  fail,
  fetchDefItems,
  clearDefItems
}) => {
  const classes = useStyles();
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
