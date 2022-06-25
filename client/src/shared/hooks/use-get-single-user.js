import { useQuery } from "react-query";
import { fetchSingleDefById } from "shared/api/defs";
import { getSingleDefsQueryKey } from "shared/consts/query-constants";
import { isFunction } from "lodash";

export const useGetSingleDef = (id, oQueryOpts = {}) => {

  return useQuery(
    [getSingleDefsQueryKey, id],
    () => fetchSingleDefById(id),{
      onSuccess: async (oResponse, ...params) => {
        if (isFunction(oQueryOpts.onSuccess)) {
          await oQueryOpts.onSuccess(oResponse, ...params)
        }
      },
      onError: async (err) => {
        if (isFunction(oQueryOpts.onError)) {
          await oQueryOpts.onError(err)
        }
      }
    }
  )
}
