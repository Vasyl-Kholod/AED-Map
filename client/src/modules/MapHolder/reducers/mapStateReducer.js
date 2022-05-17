import {
  SET_MAP_CENTER,
  SET_MAP_ZOOM,
  SET_ROUTE_END_POSITION,
  SET_TRANSPORT_TYPE
} from '../consts';

const initialState = {
  lng: 24.0311,
  lat: 49.842,
  zoom: 12.5,
  routeDetails: {
    endCoordinates: {
      lng: null,
      lat: null
    },
    transportType: 'cycling'
  }
};
export default (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case SET_MAP_CENTER: {
      if (
        state.lng === payload.lng &&
        state.lat === payload.lat
      ) {
        return state;
      }
      return { ...state, ...payload }; // here payload is {lng: number, lat: number}
    }
    case SET_MAP_ZOOM: {
      return { ...state, zoom: payload }; // here payload is number
    }
    case SET_ROUTE_END_POSITION: {
      //payload is {lng: number, lat: number}
      return { ...state, routeDetails: { ...state.routeDetails, endCoordinates: payload } };
    }
    case SET_TRANSPORT_TYPE: {
      // here payload is driving or cycling
      return { ...state, routeDetails: { ...state.routeDetails, transportType: payload } };
    }
    default:
      return state;
  }
};
