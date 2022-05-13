import { SET_SEARCH } from '../consts';

const initialState = {
  title: '',
  address: ''
};

export default function (
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case SET_SEARCH:
      return payload;
    default:
      return state;
  }
}
