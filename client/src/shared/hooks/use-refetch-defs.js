import { useQueryClient } from 'react-query';
import {
  getDefsListQueryKey,
  getDefsMapQueryKey
} from 'shared/consts/query-constants';

export const useRefetchDefsQueries = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.refetchQueries(
      [getDefsListQueryKey], { active: true }
    )
    await queryClient.refetchQueries(
      [getDefsMapQueryKey], { active: true }
    )
  }
}
