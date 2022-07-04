import {
  SET_ACTIVE,
} from './constants';

const initialState = {
  active: null,
  listData: [],
  mapData: []
};

const listReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case SET_ACTIVE:
      return {
        ...state,
        active: payload
      };
    default:
      return state;
  }
};

export default listReducer;
