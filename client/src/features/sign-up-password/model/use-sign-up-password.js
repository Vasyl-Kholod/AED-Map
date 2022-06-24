import { isFunction } from 'lodash';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { signUpUser } from 'shared/api/auth';
import { clearData } from 'shared/store/defs/actions';

import { startSignIn,successSignIn } from 'shared/store/user/actions';

const useSignUpPassword = (oMutationOpts = {}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  return useMutation(
    oCredentials => signUpUser(oCredentials),
    {
      ...oMutationOpts,
      onMutate: () => {
        dispatch(startSignIn());
        if (isFunction(oMutationOpts.onMutate)) {
          oMutationOpts.onMutate();
        }
      },
      onSuccess: (oResponse, ...restParams) => {
        const { user, token } = oResponse;
        dispatch(successSignIn(user, token));
        dispatch(clearData());
        history.push('/');

        if (isFunction(oMutationOpts.onSuccess)) {
          oMutationOpts.onSuccess(oResponse, ...restParams);
        }
      },
    }
  );
};

export { useSignUpPassword };
