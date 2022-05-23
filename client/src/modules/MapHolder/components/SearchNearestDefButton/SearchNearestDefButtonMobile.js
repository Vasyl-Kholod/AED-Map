import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Logo from 'shared/icons/logo.svg';
import useAlert from 'shared/ui/Alert/use-alert';

import { setRoutePosition } from 'modules/MapHolder/actions/mapState.js';
import { getNearestDevices } from '../../../Sidebar/api';
import { setActive } from 'modules/Sidebar/components/ItemList/actions/list.js';

function SearchNearestDefButtonMobile({
  coords,
  active,
  defs,
  geolocationProvided,
  setRoutePosition,
  setActiveId
}) {
  const [, ShowAlert] = useAlert();

  const handleRoute = async () => {
    if (!active) {
      let nearestItem;
      if (geolocationProvided) {
        nearestItem = await getNearestDevices({
          single: true,
          longitude: coords.lng,
          latitude: coords.lat
        });
      } else {
        ShowAlert({
          open: true,
          severity: 'error',
          message: 'Позиція користувача не знайдена'
        });
        return;
      }

      if (nearestItem.data.listDefs) {
        const [
          lng,
          lat
        ] = nearestItem.data.listDefs.location.coordinates;
        const { _id: id } = nearestItem.data.listDefs;
        setRoutePosition({ lng, lat }, id);
        setActiveId(id);
      } else {
        ShowAlert({
          open: true,
          severity: 'error',
          message: 'Пристроїв поблизу не виявлено'
        });
      }
    } else {
      const activeDef = defs.find(def => def._id === active);
      const [lng, lat] = activeDef.location.coordinates;
      setRoutePosition({ lng, lat })
    }
  };

  return (
    <div onClick={handleRoute}>
      <img src={Logo} alt="search" />
      <div>Прокласти</div>
      <div>маршрут</div>
    </div>
  );
}

SearchNearestDefButtonMobile.propTypes = {
  coords: PropTypes.object.isRequired
};

export default connect(
  state => ({
    coords: state.userPosition.coords,
    geolocationProvided:
      state.userPosition.geolocationProvided,
    active: state.defs.active,
    defs: state.defs.mapData
  }),
  dispatch => ({
    setActiveId: (id) => dispatch(setActive(id)),
    setRoutePosition: (routeCoords, id) =>
      dispatch(setRoutePosition(routeCoords, id)),
  })
)(SearchNearestDefButtonMobile);
