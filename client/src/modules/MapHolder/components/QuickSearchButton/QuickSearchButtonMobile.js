import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Logo from 'shared/icons/logo.svg';
import useAlert from 'shared/ui/Alert/useAlert';

import { getAvailableDefItems } from '../../../Sidebar/api/index.js';

function QuickSearchButtonMobile({
  coords,
  geolocationProvided,
  getRouteToPosition
}) {
  const [, ShowAlert] = useAlert();

  const getNearestDefibrillators = async () => {
    let nearestItem;
    if (geolocationProvided) {
      nearestItem = await getAvailableDefItems({
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
      await getRouteToPosition(lng, lat);
    } else {
      ShowAlert({
        open: true,
        severity: 'error',
        message: 'Пристроїв поблизу не виявлено'
      });
    }
  };

  return (
    <div onClick={getNearestDefibrillators}>
      <img src={Logo} alt="search" />
      <div>Прокласти</div>
      <div>маршрут</div>
    </div>
  );
}

QuickSearchButtonMobile.propTypes = {
  coords: PropTypes.object.isRequired,
  getRouteToPosition: PropTypes.func.isRequired
};

export default connect(
  state => ({
    coords: state.userPosition.coords,
    geolocationProvided:
      state.userPosition.geolocationProvided
  }),
  null
)(QuickSearchButtonMobile);
