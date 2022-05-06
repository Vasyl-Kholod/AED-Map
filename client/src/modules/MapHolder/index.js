import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactMapboxGl from 'react-mapbox-gl';
import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import useAlert from 'shared/ui/Alert/useAlert';
import { MAPBOX_TOKEN } from 'shared/consts/keys';

import { useSelector } from 'react-redux';
import { getDirections } from './api';
import { hidePopup } from './actions/popupDisplay';
import { sidebarWidth } from '../Sidebar/styleConstants';
import {
  setMapCenter,
  setMapZoom,
  addNewPoint
} from './actions/mapState';
import {
  setGeolocation,
  startWatchingPosition
} from './actions/userPosition';
import AddedPin from './layers/AddedPin';
import UserPin from './components/UserPin';
import PointLayer from './layers/PointLayer';
import RouteLayer from './layers/RouteLayer';
import PopupHolder from './components/PopupHolder';
import RouteDetails from './components/RouteDetails';
import DefibrillatorPinLayer from './layers/DefibrillatorPinLayer';
import GeoLocationButton from './components/GeoLocationButton';
import QuickSearchButton from './components/QuickSearchButton';

const useStyles = makeStyles(() => ({
  mapContainer: ({ visible }) => ({
    position: 'relative',
    height: '100vh',
    width: visible
      ? `calc(100vw - ${sidebarWidth})`
      : '100vw',
    overflow: 'hidden'
  }),
  map: {
    display: 'flex',
    height: '100%',
    width: '100%'
  },
  showIcon: {
    position: 'fixed',
    height: 64,
    margin: '10px 0 0 10px',
    zIndex: 1,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderRadius: '50%'
  },
  showMenuIcon: ({ visible }) => ({
    height: 35,
    width: 35,
    transform: `${
      visible ? 'rotate(180deg)' : 'rotate(0)'
    }`,
    transition: 'transform 0.2s'
  })
}));

const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN
});

const MapHolder = ({
  mapState,
  userPosition,
  newPoint,
  setMapCenter,
  startWatchingPosition,
  setGeolocation,
  addNewPoint,
  hidePopup,
  setVisible,
  visible
}) => {
  const classes = useStyles({ visible });
  const [, showAlert] = useAlert();
  const [map, setLocalMap] = useState(null);
  const { lng, lat, zoom} = mapState; 

  const type = useSelector(reducer => reducer.mapState.type)


  const tooltipMessage = visible
    ? 'Приховати меню'
    : 'Показати меню';

  const handlePopupClose = event => {
    if (event.target.tagName === 'CANVAS') {
      hidePopup();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handlePopupClose);
    return () => {
      document.removeEventListener(
        'click',
        handlePopupClose
      );
    };
    // eslint-disable-next-line
  }, []);

  const loadMap = async mapRaw => {
    if (mapRaw) {
      setLocalMap(mapRaw);
    }
  };

  const changeMapCenterCoords = event => {
    setMapCenter({
      ...event.getCenter(),
      zoom: event.getZoom()
    });
  };

  const onZoomEnded = event => {
    setMapCenter({
      ...mapState,
      zoom: event.getZoom()
    });
  };

  const onZoomStarted = () => {
    hidePopup();
  };

  const hideSidebar = () => {
    if (map) {
      setVisible(prev => !prev);
      setTimeout(() => {
        map.resize();
      }, 100);
    }
  };

  const getCurrentLocation = _ => {
    setGeolocation(coords => {
      if (coords == null) {
        showAlert({
          open: true,
          severity: 'error',
          message: 'Позиція користувача не знайдена'
        });
        return;
      }
      const { longitude, latitude } = coords;
      setMapCenter({
        lng: longitude,
        lat: latitude
      });
    });
  };

  useEffect(() => {
    if (Object.keys(newPoint).length !== 0) {
      const { lng, lat } = newPoint;
      setMapCenter({ lng, lat });
    }
    // eslint-disable-next-line
  }, [newPoint]);

  //Sets map center to current Position of the user
  useEffect(() => {
    setGeolocation(coords => {
      if (coords == null) {
        return;
      }
      const { longitude, latitude } = coords;
      setMapCenter({ lng: longitude, lat: latitude });
      startWatchingPosition();
    });
  }, [setGeolocation, setMapCenter, startWatchingPosition]);

  const onDblClickMap = (_, event) => {
    const currentRoute = window.location.pathname;
    if (
      currentRoute === '/add-form' ||
      currentRoute.includes('/edit-form')
    ) {
      const { lng, lat } = event.lngLat;
      addNewPoint({ lng, lat });
      event.preventDefault();
    }
  };

  const getRouteToPosition = async (endLng, endLat) => {
    await setMapCenter({ lng: endLng, lat: endLat });
    getRoute(userPosition.coords, {
      lng: endLng,
      lat: endLat,
    });
  };

  const [routeCoords, setRouteCords] = useState([]);


  const [routeDetails, setRouteDetails] = useState({
    distance: null,
    duration: null
  });


  const [showRouteDetails, setShowRouteDetails] = useState(
    false
  );

  const getRoute = async (start, endPosition) => {

    const query = await getDirections(start, endPosition, {}, type);
    const data = query.data.routes[0];

    setRouteCords(data.geometry.coordinates);
    setShowRouteDetails(true);
    setRouteDetails({
      distance: data.distance,
      duration: data.duration
    });
  };

  const closeRoute = () => {
    setRouteCords([]);
    setShowRouteDetails(false);
    getCurrentLocation();
  };

  return (
    <div className={classes.mapContainer}>
      <QuickSearchButton
        getRouteToPosition={getRouteToPosition}
      />
      <GeoLocationButton
        currentLocation={getCurrentLocation}
      />
      <Button
        className={classes.showIcon}
        color="primary"
        onClick={hideSidebar}
        size="small"
      >
        <Tooltip title={tooltipMessage}>
          <ChevronRightIcon
            className={classes.showMenuIcon}
          />
        </Tooltip>
      </Button>

      {showRouteDetails && (
        <RouteDetails
          onClose={closeRoute}
          details={routeDetails}
          getRouteToPosition = {getRouteToPosition}
        />
      )}

      <Map
        // eslint-disable-next-line react/style-prop-object
        style="mapbox://styles/oskovbasiuk/ck5nwya36638v1ilpmwxlfv5g"
        className={classes.map}
        center={[lng, lat]}
        zoom={[zoom]}
        onStyleLoad={loadMap}
        onZoomEnd={onZoomEnded}
        onZoomStart={onZoomStarted}
        onRotateEnd={changeMapCenterCoords}
        onDragEnd={changeMapCenterCoords}
        onDblClick={onDblClickMap}
      >
        {map && <DefibrillatorPinLayer map={map} />}
        {userPosition.geolocationProvided && (
          <UserPin
            classes={classes}
            coordinates={userPosition.coords}
          />
        )}

        {Object.keys(newPoint).length !== 0 && (
          <AddedPin coordinates={newPoint} />
        )}

        <PopupHolder />

        {routeCoords.length > 0 && (
          <>
            <RouteLayer coordinates={routeCoords} />
            <PointLayer coordinates={routeCoords} />
          </>
        )}
      </Map>
    </div>
  );
};

MapHolder.defaultProps = {
  mapState: {},
  setVisible: {},
  visible: null,
  setMapCenter: () => {},
  setGeolocation: () => {},
  startWatchingPosition: () => {},
  hidePopup: () => {}
};

MapHolder.propTypes = {
  mapState: PropTypes.shape({
    lng: PropTypes.number,
    lat: PropTypes.number,
    zoom: PropTypes.number
  }),
  newPoint: PropTypes.shape({
    lng: PropTypes.number,
    lat: PropTypes.number
  }).isRequired,
  addNewPoint: PropTypes.func.isRequired,
  setMapCenter: PropTypes.func,
  setMapZoom: PropTypes.func,
  startWatchingPosition: PropTypes.func,
  hidePopup: PropTypes.func,
  setVisible: PropTypes.func,
  visible: PropTypes.bool
};

export default connect(
  state => ({
    transportTypeState:state.type,
    defsState: state.defs,
    mapState: state.mapState,
    newPoint: state.newPoint,
    userPosition: state.userPosition
  }),
  dispatch => ({
    setGeolocation: f => dispatch(setGeolocation(f)),
    startWatchingPosition: () =>
      dispatch(startWatchingPosition()),
    setMapCenter: map => dispatch(setMapCenter(map)),
    setMapZoom: zoom => dispatch(setMapZoom(zoom)),
    addNewPoint: newPoint =>
      dispatch(addNewPoint(newPoint)),
    hidePopup: () => dispatch(hidePopup())
  })
)(MapHolder);
