import {
  SET_ACTIVE,
  CREATE_DEF_POINT,
  DELETE_DEF_POINT,
  EDIT_DEF_POINT,
  BLOCK_DEF_POINT,
} from './constants';

const initialState = {
  active: null,
  coordinates: null,
  listData: [],
  mapData: []
};

const listReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case CREATE_DEF_POINT:
      return {
        ...state,
        listData: [payload, ...state.listData],
        mapData: [payload, ...state.mapData]
      };
    case DELETE_DEF_POINT:
      return {
        ...state,
        /* eslint-disable-next-line */
        listData: state.listData.filter(
          def => def._id !== payload
        ),
        mapData: state.mapData.filter(
          def => def._id !== payload
        )
      };
    case EDIT_DEF_POINT: {
      const { id, newDefInfo } = payload;
      const updateItem = def => {
        /* eslint-disable-next-line */
        if (def._id === id) {
          return { ...def, ...newDefInfo };
        }
        return def;
      };
      const newListData = state.listData.map(updateItem);
      const newMapData = state.mapData.map(updateItem);

      return {
        ...state,
        listData: newListData,
        mapData: newMapData
      };
    }
    case BLOCK_DEF_POINT: {
      const { id, blocked } = payload;
      const updateItem = def => {
        /* eslint-disable-next-line */
        if (def._id === id) {
          return { ...def, blocked };
        }
        return def;
      };
      const newListData = state.listData.map(updateItem);
      const newMapData = state.mapData.map(updateItem);

      return {
        ...state,
        listData: newListData,
        mapData: newMapData
      };
    }
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
