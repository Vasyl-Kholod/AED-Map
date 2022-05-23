import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactMapboxGl from 'react-mapbox-gl';
import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import useAlert from 'shared/ui/Alert/use-alert';
import { MAPBOX_TOKEN } from 'shared/consts/keys';

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
import { setActive } from 'modules/Sidebar/components/ItemList/actions/list';

import AddedPin from './layers/AddedPin';
import UserPin from './components/UserPin';
import PointLayer from './layers/PointLayer';
import RouteLayer from './layers/RouteLayer';
import PopupHolder from './components/PopupHolder';
import RouteDetails from './components/RouteDetails';
import DefibrillatorPinLayer from './layers/DefibrillatorPinLayer';
import GeoLocationButton from './components/GeoLocationButton';
import SearchNearestDefButton from './components/SearchNearestDefButton';
import SearchNextNearestDefButton from './components/SearchNextNearestDefButton';

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
    height: '100vh',
    width: '100vw'
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
    transform: `${visible ? 'rotate(180deg)' : 'rotate(0)'
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
  transportType,
  endRouteCoords,
  setMapCenter,
  setMapZoom,
  startWatchingPosition,
  setGeolocation,
  addNewPoint,
  hidePopup,
  setVisible,
  setActiveId,
  isSearchNextDefButton,
  visible
}) => {
  const classes = useStyles({ visible });
  const [, showAlert] = useAlert();
  const [map, setLocalMap] = useState(null);
  const { lng, lat, zoom } = mapState;
 

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
      //TODO: this method must be deleted, because it causes to error in console and causes to return icons to the previous state. 
      // startWatchingPosition();
    });
  }, [setGeolocation, setMapCenter]);

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

  const [routeCoords, setRouteCords] = useState([]);

  const [routeDetails, setRouteDetails] = useState({
    distance: null,
    duration: null
  });

  const [showRouteDetails, setShowRouteDetails] = useState(
    false
  );

  const getRoute = async (start, endPosition, type) => {
    const query = await getDirections(
      type,
      start,
      endPosition
    );
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
    setActiveId(null);
  };

  // To build the route, set ending point coordinates to the redux state
  // you can use setRoutePosition from mapState.js or custom
  useEffect(() => {
    const getRouteToPosition = async (types = transportType) => {
      if (!!endRouteCoords.lng) {
        setMapCenter({ lng: endRouteCoords.lng, lat: endRouteCoords.lat });
        setMapZoom(13.5)
        await getRoute(
          userPosition.coords,
          {
            lng: endRouteCoords.lng,
            lat: endRouteCoords.lat
          },
          types
        );
      }
    }
    getRouteToPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endRouteCoords, transportType])

  return (
    <div className={classes.mapContainer}>
      <SearchNearestDefButton />

      {routeCoords.length > 0 && isSearchNextDefButton && (
        <SearchNextNearestDefButton />
      )}

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
  setMapCenter: () => { },
  setGeolocation: () => { },
  startWatchingPosition: () => { },
  hidePopup: () => { }
};

MapHolder.propTypes = {
  mapState: PropTypes.shape({
    lng: PropTypes.number,
    lat: PropTypes.number,
    zoom: PropTypes.number,
    routeDetails: {
      endCoordinates: {
        lng: PropTypes.number,
        lat: PropTypes.number
      },
      transportType: PropTypes.string
    }
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
    transportType: state.mapState.routeDetails.transportType,
    endRouteCoords: state.mapState.routeDetails.endCoordinates,
    defsState: state.defs,
    mapState: state.mapState,
    newPoint: state.newPoint,
    userPosition: state.userPosition,
    defActiveId: state.defs.active,
    defIndex: state.defs.defIndex,
    isSearchNextDefButton: state.mapState.isSearchNextDefButton
  }),
  dispatch => ({
    setGeolocation: f => dispatch(setGeolocation(f)),
    startWatchingPosition: () =>
      dispatch(startWatchingPosition()),
    setMapCenter: map => dispatch(setMapCenter(map)),
    setMapZoom: zoom => dispatch(setMapZoom(zoom)),
    addNewPoint: newPoint =>
      dispatch(addNewPoint(newPoint)),
    hidePopup: () => dispatch(hidePopup()),
    setActiveId: id => dispatch(setActive(id))
  })
)(MapHolder);
