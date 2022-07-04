import { useQuery } from "react-query";
import { useSelector } from 'react-redux';
import { getDefMapItems } from "shared/api/defs";
import { getDefsMapQueryKey } from "shared/consts/query-constants";

import { isFunction } from 'lodash';

export const useGetDefsMap = (oQueryOptions = {}) => {
  const params = useSelector( state => {
    return {
      ...state.filter,
      ...state.search
    }
  });

  return useQuery(
    [getDefsMapQueryKey, params],
    () => getDefMapItems(params), {
      onSuccess: (oResponse, ...restParams) => {
        if (isFunction(oQueryOptions.onSuccess)) {
          oQueryOptions.onSuccess(oResponse, ...restParams);
        }
      },
      onError: e => {
        if (isFunction(oQueryOptions.onError)) {
          oQueryOptions.onError(e);
        }
      },
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  )
}
