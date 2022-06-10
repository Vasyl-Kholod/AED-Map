import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { DirectionsBike } from '@material-ui/icons';
import {
  useRouteDetailsStyles,
  createRouteDetailsStyles
} from '../model/use-styles';
import { useDistanceAndDuration } from '../model/use-distance-and-duration';
import { useDispatch, useSelector } from 'react-redux';
import { DirectionsCarSharp } from '@material-ui/icons';

import { changeTransportType } from 'shared/store/map/actions';

const detailsStyle = createRouteDetailsStyles();

function RouteDetails({
  onClose,
  details,
  getRouteToPosition
}) {
  const dispatch = useDispatch();
  const { finalDistance, approximateTime } = useDistanceAndDuration(details);
  const classes = useRouteDetailsStyles();

  const type = useSelector(
    reducer => reducer.mapState.routeDetails.transportType
  );

  const handleClick = type => {
    dispatch(changeTransportType(type));
  };

  return (
    <div style={detailsStyle.container}>
      <div>
        <form id="params">
          <h6>Оберіть вид пересування:</h6>
          <div style={detailsStyle.containerIcon}>
            <IconButton
              onClick={() => handleClick('driving')}
              color="inherit"
              className={`${classes.type_icon} ${type === 'driving'
                  ? classes.type_icon_selected
                  : ''
                }`}
            >
              <DirectionsCarSharp />
            </IconButton>

            <IconButton
              onClick={() => handleClick('cycling')}
              color="inherit"
              className={`${classes.type_icon} ${type === 'cycling'
                  ? classes.type_icon_selected
                  : ''
                }`}
            >
              <DirectionsBike />
            </IconButton>
          </div>
        </form>
      </div>

      <h6 style={detailsStyle.timer}>
        {approximateTime}хв <span>({finalDistance}км)</span>
      </h6>
      <button
        style={detailsStyle.button}
        type="button"
        onClick={onClose}
      >
        Cкасувати маршрут
      </button>
    </div>
  );
}

RouteDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired
};

export default RouteDetails;
