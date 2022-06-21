import {
  editItem,
  blockItem,
  createItem,
  deleteItem
} from 'shared/api/defs';

import {
  CREATE_DEF_POINT,
  DELETE_DEF_POINT,
  EDIT_DEF_POINT,
  BLOCK_DEF_POINT,
  SET_ACTIVE,
  SET_PER_PAGE
} from './constants';

export const setActive = id => {
  return {
    type: SET_ACTIVE,
    payload: id
  };
};

export const createDefPoint = newDef => {
  return {
    type: CREATE_DEF_POINT,
    payload: newDef
  };
};

export const deleteDefPoint = id => {
  return {
    type: DELETE_DEF_POINT,
    payload: id
  };
};

export const editDefPoint = (id, newDefInfo) => {
  return {
    type: EDIT_DEF_POINT,
    payload: {
      id,
      newDefInfo
    }
  };
};

export const blockDefPoint = (id, blocked) => {
  return {
    type: BLOCK_DEF_POINT,
    payload: {
      id,
      blocked
    }
  };
};

export const createDefItem = newItem => {
  return async dispatch => {
    try {
      const { data } = await createItem(newItem);
      dispatch(createDefPoint(data.defibrillator));
    } catch (e) {
      console.log(e)
    }
  };
};

export const deleteDefItem = id => {
  return async dispatch => {
    try {
      const { data } = await deleteItem(id);
      dispatch(deleteDefPoint(data.defibrillator._id));
    } catch (e) {
      console.log(e)
    }
  };
};

export const editDefItem = (id, newDefInfo) => {
  return async dispatch => {
    try {
      const { data } = await editItem(id, newDefInfo);
      const { defibrillator } = data;
      dispatch(
        editDefPoint(defibrillator._id, defibrillator)
      );
    } catch (e) {
      console.log(e)
    }
  };
};

export const blockDefItem = (id, blocked) => {
  return async dispatch => {
    try {
      const { data } = await blockItem(id, { blocked });
      const { defibrillator } = data;
      dispatch(
        blockDefPoint(
          defibrillator._id,
          defibrillator.blocked
        )
      );
    } catch (e) {
      console.log(e)
    }
  };
};

export const setPerPage = perPage => {
  return {
    type: SET_PER_PAGE,
    payload: perPage
  };
};
