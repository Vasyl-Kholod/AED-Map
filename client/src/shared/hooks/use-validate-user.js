const { useMutation } = require('react-query');
const { validateUser } = require('shared/api/auth');

const useValidateUser = oMutationOpts =>
  useMutation(async () => {
    const oResponse = await validateUser();

    return {
      data: oResponse?.headers,
      authorization: oResponse?.headers?.authorization
    };
  }, oMutationOpts);

export { useValidateUser };
