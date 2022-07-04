import { editItem } from "shared/api/defs";
import { createImage } from "shared/api/defs";
import { useMutation, useQueryClient } from "react-query";
import {
  getDefsListQueryKey,
  getDefsMapQueryKey
} from "shared/consts/query-constants";
import { isFunction } from "lodash";

export const useEditDef = (oMutationOpts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ editedDef, ImageFormData }) => {
      const response = await editItem(editedDef);

      await createImage(
        ImageFormData,
        response.defibrillator._id
      );
    }, {
      ...oMutationOpts,
      onSuccess: async (oResponse, ...params) => {
        await queryClient.refetchQueries(
          [getDefsListQueryKey], { active: true }
        )
        await queryClient.refetchQueries(
          [getDefsMapQueryKey], { active: true }
        )

        if (isFunction(oMutationOpts.onSuccess)) {
          await oMutationOpts.onSuccess(oResponse, ...params)
        }
      }
    }
  )
}
