import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { changeTransportType } from 'modules/MapHolder/actions/mapState';
import { DirectionsCarSharp } from '@material-ui/icons';
import { DirectionsBike } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const detailsStyle = {
  container: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(40, 44, 52, 1)',
    borderRadius: '5px',
    border: '2px solid rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px'
  },
  button: {
    backgroundColor: 'rgba(162, 165, 173, 1)',
    fontSize: '0.9rem',
    padding: '2px',
    marginTop: '5px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  transportInput: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px'
  },
  containerIcon: {
    display: 'flex',
    gap: '10px',
    padding: '8px',
    justifyContent: 'center'
  },
  radio: {
    marginTop: '10px',
    visibility: 'hidden'
  },
  timer: {
    display: 'flex',
    justifyContent: 'center'
  },
  type_icon: {
    '&:hover': {
      backgroundColor: 'red'
    }
  },
  type_icon_selected: {
    backgroundColor: 'green'
  }
};

const useStyles = makeStyles(theme => ({
  type_icon: {
    backgroundColor: 'gray',
    width: '30px',
    height: '30px',
    position: 'relative',
    '&:hover': {
      backgroundColor: ' inherit',
      opacity: 0.4
    }
  },
  type_icon_selected: {
    backgroundColor: 'blue',
    width: '30px',
    height: '30px'
  }
}));

function RouteDetails({
  onClose,
  details,
  getRouteToPosition
}) {
  const dispatch = useDispatch();
  const { distance, duration } = details;
  const finalDistance = (distance / 1000).toFixed(2);
  const approximateTime = Math.floor(duration / 60);
  const classes = useStyles();

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
