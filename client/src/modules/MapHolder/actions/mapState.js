import {
  ADD_NEW_POINT,
  SET_MAP_CENTER,
  SET_MAP_ZOOM,
  SET_ROUTE_END_POSITION,
  SET_TRANSPORT_TYPE
} from '../consts';

import { setActive } from 'modules/Sidebar/components/ItemList/actions/list';

export const setMapCenter = mapState => {
  return {
    type: SET_MAP_CENTER,
    payload: mapState
  };
};

export const setMapZoom = zoom => {
  return {
    type: SET_MAP_ZOOM,
    payload: zoom
  };
};

export const addNewPoint = newPoint => {
  return {
    type: ADD_NEW_POINT,
    payload: newPoint
  };
};

// Sets end route coordinated and set the item with id as active
export const setRoutePosition = ( routeCoords, id ) => {
  return dispatch => {
    dispatch( (() => {
      return {
        type: SET_ROUTE_END_POSITION,
        payload: routeCoords
      }
    })())
    if ( !!id ) {
      dispatch(setActive(id))
    }
  }
}

export const changeTransportType = type => {
  return {
    type: SET_TRANSPORT_TYPE,
    payload: type
  };
};
