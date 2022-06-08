import { combineReducers } from 'redux';

import userReducer from './user/reducer';
import mapStateReducer from './map/reducer';
import filterReducer from './filter/reducer';
import searchReducer from './search/reducer';
import addNewPointReducer from './point/reducer';
import popupDisplayReducer from './popup/reducer';
import userPositionReducer from './user-position/reducer';
import listReducer from './list/reducer';
import setFullTimeReducer from './full-time/reducer';


export default combineReducers({
  defs: listReducer,
  user: userReducer,
  filter: filterReducer,
  search: searchReducer,
  mapState: mapStateReducer,
  newPoint: addNewPointReducer,
  popupData: popupDisplayReducer,
  setFullTime: setFullTimeReducer,
  userPosition: userPositionReducer
});
