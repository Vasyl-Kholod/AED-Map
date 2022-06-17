import { isFunction } from 'lodash';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { signUpSendmail } from 'shared/api/auth';
import { socketAuthOpen } from 'shared/websocket';
import { clearData } from 'shared/store/defs/actions';


const useSignUpMail = (oMutationOpts = {}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  return useMutation(
    async oCredentials => signUpSendmail(oCredentials),
    {
      ...oMutationOpts,
      onMutate: () => {
        if (isFunction(oMutationOpts.onMutate)) {
          oMutationOpts.onMutate();
        }
      },
      onSuccess: (oResponse, ...restParams) => {
        const { user, token } = oResponse;

        socketAuthOpen(token);
        dispatch(clearData());
        history.push('/');

        if (isFunction(oMutationOpts.onSuccess)) {
          oMutationOpts.onSuccess(oResponse, ...restParams);
        }
      },
      onError: e => {
        if (isFunction(oMutationOpts.onError)) {
          oMutationOpts.onError(e);
        }
      }
    }
  );
};

export { useSignUpMail };
