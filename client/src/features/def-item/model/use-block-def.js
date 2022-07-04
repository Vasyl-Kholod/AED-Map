import { useMutation, useQueryClient } from "react-query";
import { blockItem } from "shared/api/defs";
import { useRefetchDefsQueries } from 'shared/hooks/use-refetch-defs';
import { getSingleDefsQueryKey } from "shared/consts/query-constants";
import { isFunction } from "lodash";

export const useBlockDef = (oMutationOpts = {}) => {
  const queryClient = useQueryClient();

  const refetchDefs = useRefetchDefsQueries();

  return useMutation(
    async ({id, params}) => blockItem(id, params), {
      ...oMutationOpts,
      onSuccess: async (oResponse, ...params) => {
        await refetchDefs();
        await queryClient.refetchQueries(
          [getSingleDefsQueryKey], { active: true }
        )

        if (isFunction(oMutationOpts.onSuccess)) {
          await oMutationOpts.onSuccess(oResponse, ...params)
        }
      }
    }
  )
};
