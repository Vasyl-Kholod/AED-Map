import { combineReducers } from 'redux';

import userReducer from './user/reducer';
import mapStateReducer from './map/reducer';
import filterReducer from './filter/reducer';
import searchReducer from './search/reducer';
import addNewPointReducer from './point/reducer';
import popupDisplayReducer from './shared/store/popup/reducer';
import userPositionReducer from './shared/store/user-position/reducer';
import listReducer from './shared/store/list/reducer';
import listReducer  from './shared/store/list/reducer';
import setFullTimeReducer from './shared/store/full-time/reducer';

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
