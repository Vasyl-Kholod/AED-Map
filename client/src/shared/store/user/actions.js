import {
  SIGNOUT,
  FAIL_SIGNIN,
  START_SIGNIN,
  SUCCESS_SIGNIN
} from './constants';

export const startSignIn = () => {
  return {
    type: START_SIGNIN
  };
};

export const successSignIn = (user, authorization) => {
  localStorage.setItem(
    'authorization',
    JSON.stringify(authorization)
  );

  return {
    type: SUCCESS_SIGNIN,
    payload: user
  };
};

export const failSignIn = () => {
  localStorage.removeItem('authorization');

  return {
    type: FAIL_SIGNIN
  };
};

export const signOut = () => {
  localStorage.removeItem('authorization');

  return {
    type: SIGNOUT
  };
};
