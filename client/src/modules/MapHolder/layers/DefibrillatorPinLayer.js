/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Cluster, Marker } from 'react-mapbox-gl';
import { makeStyles } from '@material-ui/core/styles';

import mapPin from 'shared/icons/map-pin-icon.jpg';
import activeMapPin from 'shared/icons/active-map-pin-icon.jpg';

import geoJsonData from '../geoJsonData';
import { showPopup } from '../../../shared/store/popupDisplay/actions';
import { setActive } from '../../../shared/store/list/list';

const useStyles = makeStyles(() => ({
  clusterMarker: {
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(124, 124, 124, 0.9)',
    boxShadow: '1px 1px 3px rgba(124, 124, 124, 0.9)',
    color: 'white',
    fontWeight: 900,
    cursor: 'pointer'
  },
  marker: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '200px'
  },
  markerWrapper: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    textShadow: '1px 1px 2px white',
    cursor: 'pointer'
  },
  title: {
    width: 200
  },
  pin: {
    width: 30,
    height: 30
  }
}));

const DefibrillatorPinLayer = ({
  defibrillators,
  showPopup,
  makeItemActive,
  defibrillatorsActiveId,
  history
}) => {
  const GEO_JSON_DATA = geoJsonData(defibrillators);
  const classes = useStyles();

  const defibrillatorPinClick = feature => {
    
    const { defID } = feature.properties;
    const { coordinates } = feature.geometry;
    const currentRoute = window.location.pathname;
    if (
      currentRoute !== '/add-form' &&
      !currentRoute.includes('/edit-form')
    ) {
      showPopup({
        data: {
          id: defID
        },
        coordinates
      });
      makeItemActive(defID);
      history.push(`/?id=${defID}`);
    }
  };

  const clusterRender = GEO_JSON_DATA.features.map(
    feature => {
      return (
        <Marker
          className={classes.marker}
          key={feature.properties.defID}
          coordinates={feature.geometry.coordinates}
          onClick={() => defibrillatorPinClick(feature)}
        >
          <div className={classes.markerWrapper}>
            <img
              alt="Map Pin"
              src={defibrillatorsActiveId === feature?.properties?.defID ? activeMapPin : mapPin}
              className={classes.pin}
            />
            <p className={classes.title}>
              {feature.properties.title}
            </p>
          </div> 
        </Marker>
      );
    }
  );

  const clusterMarker = (coordinates, pointCount) => {
    return (
      <Marker
        key={coordinates}
        coordinates={coordinates}
        className={classes.clusterMarker}
      >
        {pointCount}
      </Marker>
    );
  };

  return (
    <Cluster
      ClusterMarkerFactory={clusterMarker}
      zoomOnClick
      zoomOnClickPadding={80}
      radius={100}
      extent={290}
    >
      {clusterRender}
    </Cluster>
  );
};

DefibrillatorPinLayer.defaultProps = {
  defibrillators: [],
  showPopup: () => null
};

DefibrillatorPinLayer.propTypes = {
  defibrillators: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      address: PropTypes.string,
      location: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.arrayOf(PropTypes.number)
      }),
      actual_date: PropTypes.string,
      floor: PropTypes.number,
      storage_place: PropTypes.string,
      availableFrom: PropTypes.string,
      language: PropTypes.string,
      informational_plates: PropTypes.string,
      phone: PropTypes.arrayOf(PropTypes.string),
      additional_information: PropTypes.string
    })
  ),
  showPopup: PropTypes.func,
  makeItemActive: PropTypes.func.isRequired,

  mapState: PropTypes.shape({
    lng: PropTypes.number,
    lat: PropTypes.number,
    zoom: PropTypes.number
  }).isRequired,
  history: PropTypes.shape().isRequired
};

export default connect(
  state => ({
    defibrillators: state.defs.mapData,
    defibrillatorsActiveId: state.defs.active,
    mapState: state.mapState
  }),
  dispatch => ({
    showPopup: popupInfo => dispatch(showPopup(popupInfo)),
    makeItemActive: itemId => dispatch(setActive(itemId))
  })
)(withRouter(DefibrillatorPinLayer));
