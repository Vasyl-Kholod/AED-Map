import { useDispatch, useSelector } from 'react-redux';

import { setSearch } from 'shared/store/search/actions';

const useSearchDevices = () => {
  const dispatch = useDispatch();
  const address = useSelector(
    state => state.search.address
  );

  const onSearch = ({ target: { value } }) => {
    const val = value.trim();

    dispatch(setSearch({ title: val, address: val }));
  };

  return {
    address,
    onSearch
  };
};

export { useSearchDevices };
