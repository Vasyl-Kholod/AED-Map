import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { changeType } from 'modules/MapHolder/actions/mapState';

const detailsStyle = {
  container: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    position: 'fixed',
    bottom: '5%',
    right: '160px',
    zIndex: '30',
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
  radio: {
    marginTop: '10px'
  }
};

function RouteDetails({
  onClose,
  details,
  getRouteToPosition
}) {
  const dispatch = useDispatch();
  const { distance, duration } = details;
  const finalDistance = (distance / 1000).toFixed(2);
  const approximateTime = Math.floor(duration / 60);

  const type = useSelector(
    reducer => reducer.mapState.type
  );
  const lat = useSelector(reducer => reducer.mapState.lat);
  const lng = useSelector(reducer => reducer.mapState.lng);

  const handleChange = event => {
    dispatch(changeType(event.target.value));
    getRouteToPosition(lng, lat, event.target.value);
  };

  return (
    <div style={detailsStyle.container}>
      <div>
        <form id="params">
          <h4>Choose a travel mode:</h4>
          <div>
            <label style={detailsStyle.transportInput}>
              <input
                style={detailsStyle.radio}
                type="radio"
                value="cycling"
                checked={type === 'cycling'}
                onChange={handleChange}
              />
              <div>Cycling</div>
            </label>

            <label style={detailsStyle.transportInput}>
              <input
                style={detailsStyle.radio}
                type="radio"
                value="driving"
                checked={type === 'driving'}
                onChange={handleChange}
              />
              <div>Driving</div>
            </label>
          </div>
        </form>
      </div>

      <p>
        {approximateTime}хв <span>({finalDistance}км)</span>
      </p>
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
