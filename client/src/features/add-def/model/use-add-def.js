import { useMutation } from "react-query";
import { createItem } from "shared/api/defs";
import { createImage } from "shared/api/defs";
import { useRefetchDefsQueries } from 'shared/hooks/use-refetch-defs';
import { isFunction } from "lodash";

export const useAddDef = (oMutationOpts = {}) => {
  const refetchDefs = useRefetchDefsQueries();

  return useMutation(
    async ({ newDef, ImageFormData }) => {
      const res = await createItem(newDef);

      await createImage(
        ImageFormData,
        res.defibrillator._id
      )
    }, {
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
