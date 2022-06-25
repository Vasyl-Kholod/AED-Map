import {
  SET_ACTIVE,
  SET_PER_PAGE
} from './constants';

export const setActive = id => {
  return {
    type: SET_ACTIVE,
    payload: id
  };
};

export const setPerPage = perPage => {
  return {
    type: SET_PER_PAGE,
    payload: perPage
  };
};
