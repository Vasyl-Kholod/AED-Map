import { useInfiniteQuery, useQueryClient } from 'react-query';
import { getDefsListQueryKey } from 'shared/consts/query-constants';
import { useSelector } from 'react-redux';
import { getDefItemsList } from 'shared/api/defs';

import { isFunction } from 'lodash';

export const useGetDefsList = (oQueryOptions = {}) => {
  const params = useSelector( state => {
    return {
      ...state.filter,
      ...state.search
    }
  });

  const userPosition= useSelector( state => state.userPosition);
  const { geolocationProvided } = userPosition;
  const { lat, lng } = userPosition.coords;
  
  const getDefs = async (page) => {
    if (geolocationProvided) {
      return await getDefItemsList({
        page,
        latitude: lat,
        longitude: lng,
        ...params
      })
    } else {
      return await getDefItemsList({ page, ...params })
    }
  }

  return useInfiniteQuery(
    [getDefsListQueryKey, params],
    ({ pageParam: page = 1 }) => getDefs(page), {
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
      getNextPageParam: (lastPage, allPages) => {
        if (allPages.length < lastPage.totalCount) {
          return allPages.length + 1
        }
      },
      select: data => [].concat(...data.pages.map((page) => page.listDefs)),
      keepPreviousData: true
    }
  )
};

export const useRefetchDefsList = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.refetchQueries([getDefsListQueryKey], { active: true })
  }
}
