import { useMutation } from "react-query";
import { deleteItem } from "shared/api/defs";
import { useRefetchDefsQueries } from "shared/hooks/use-refetch-defs";
import { isFunction } from "lodash";

export const useDeleteDef = (oMutationOpts = {}) => {
  const refetchDefs = useRefetchDefsQueries();

  return useMutation(
    async (id) => deleteItem(id), {
      ...oMutationOpts,
      onSuccess: async (oResponse, ...params) => {
        await refetchDefs();

        if (isFunction(oMutationOpts.onSuccess)) {
          await oMutationOpts.onSuccess(oResponse, ...params)
        }
      }
    }
  )
};
