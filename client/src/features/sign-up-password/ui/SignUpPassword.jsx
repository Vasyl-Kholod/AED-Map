import React, { useEffect, useState } from 'react';
import { isFunction } from 'lodash';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';
import { Container } from '@material-ui/core';

import { cancelToken } from 'shared/utils';
import { signUpUser } from 'shared/api/auth';
import { socketAuthOpen } from 'shared/websocket';

import { useSignUpPassword } from '../model/use-sign-up-password';

import SignUpSchema from 'features/sign-up-password/model/validator';
import { INITIAL_VALUES } from 'features/sign-up-password/lib/constants';
import { useSignUpPasswordStyles } from 'features/sign-up-password/model/use-styles';

import Form from './Form';
import Header from './Header';
import Footer from './Footer';

const SignUpCancelToken = cancelToken();

const SignUpPassword = () => {
  const signUpMutation = useSignUpPassword();
  const classes = useSignUpPasswordStyles();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { email, token } = useParams();
  const dispatch = useDispatch();

  const handleSubmit =  (oMutationOpts = {}) =>  async (
    values, 
    { resetForm, setSubmitting }
  ) => {
    signUpMutation.mutate(
      { values, token },
      {
        onSuccess: (oResponse) => {
          const { user, token } = oResponse;
          
          dispatch(signUpUser(user, token));
          socketAuthOpen(token);
          resetForm();

          if (isFunction(oMutationOpts.onSuccess)) {
            oMutationOpts.onSuccess(
              oResponse
            );
          }
        },

        onError: e =>
          setError(e?.message || e?.response?.message)
      }
    );
    setSubmitting(false);
  };


  useEffect(() => {
    return () => {
      SignUpCancelToken.cancel();
    };
  }, []);

  return (
    <div className={classes.background}>
      <div className={classes.paperOuter}>
        <Container component="main" maxWidth="xs">
          <div className={classes.paperInner}>
            <Header />

            <Formik
              initialValues={INITIAL_VALUES}
              validationSchema={SignUpSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form
                  email={email}
                  isSubmitting={isSubmitting}
                />
              )}
            </Formik>

            <Footer success={success} error={error} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default SignUpPassword;
