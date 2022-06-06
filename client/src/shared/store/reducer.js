import { combineReducers } from 'redux';

import userReducer from './user/reducer';
import filterReducer from './filter/reducer';
import searchReducer from './search/reducer';
import mapStateReducer from 'modules/MapHolder/reducers/mapStateReducer';
import addNewPointReducer from 'modules/MapHolder/reducers/addNewPointReducer';
import popupDisplayReducer from 'modules/MapHolder/reducers/popupDisplayReducer';
import userPositionReducer from 'modules/MapHolder/reducers/userPositionReducer';
import listReducer from 'modules/Sidebar/components/ItemList/reducers/listReducer';
import setFullTimeReducer from 'modules/Sidebar/components/EditForm/reducers/index';

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
