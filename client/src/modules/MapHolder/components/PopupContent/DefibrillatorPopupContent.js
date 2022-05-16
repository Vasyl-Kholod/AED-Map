import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Cancel } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import DirectionsIcon from '@material-ui/icons/Directions';
import React, { useState, useEffect } from 'react';

import { cancelToken } from 'shared/utils';
import Loader from 'shared/ui/Loader';

import { setRoutePosition } from 'modules/MapHolder/actions/mapState';
import { titles } from './consts';
import { hidePopup } from '../../actions/popupDisplay';
import { fetchSingleDefById } from '../../../Sidebar/api';

import ModalPhoto from './PhotoGallery';

const currDefCancelToken = cancelToken();

const useStyle = makeStyles({
  popupContainer: {
    maxWidth: 400,
    maxHeight: 270,
    padding: '5px 15px',
    overflowY: 'auto',
    color: 'white',
    '&::-webkit-scrollbar': {
      width: '5px'
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'rgba(0,0,0,0.1)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255,255,255,0.3)'
    },
    '& p': {
      marginBottom: 5
    }
  },
  title: {
    color: '#bbb',
    fontWeight: 'bold'
  },
  closeBtn: {
    position: 'fixed',
    zIndex: 1000,
    right: 20,
    top: 15,
    width: 20,
    height: 20,
    cursor: 'pointer',
    color: 'grey'
  },
  imagePreview: {
    display: 'block',
    maxWidth: 110,
    height: 'auto',
    marginBottom: 5,
    borderRadius: 5,
    boxShadow: '0 2px 10px rgba(255, 255, 255, .4)'
  },
  routeIconContainer: {
    position: 'fixed',
    top: 10,
    right: 50,
  },
  routeIcon: {
    fontSize: '30px',
    color: 'grey',
    '&:hover' : {
      color:'#1976d2'
    }
  }
});

const DefibrillatorPopupContent = ({
  id, 
  hidePopup,
  setRoutePosition
}) => {
  const classes = useStyle();
  const [currDef, setCurrDef] = useState(null);

  const formatData = (key, def) => {
    if (key === 'actual_date') {
      return new Date(def[key]).toLocaleDateString(
        'uk-UA',
        {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }
      );
    }

    if (key === 'phone') {
      return def[key].join(', ');
    }

    if (key === 'availableFrom') {
      const availableTime =
        def.fullTimeAvailable === true
          ? 'Цілодобово доступний'
          : `${def.availableFrom
              .toString()
              .padStart(2, '0')}:00 - 
             ${def.availableUntil
               .toString()
               .padStart(2, '0')}:00`;
      return availableTime;
    }

    return def[key];
  };

  const handleRoute = () => {
    const [ lng, lat ] = currDef.location.coordinates;
    const { _id : id } = currDef
    setRoutePosition( { lng, lat }, id );
    hidePopup();
  }

  useEffect(() => {
    const fetchData = async () => {
      setCurrDef(null);
      const res = await fetchSingleDefById(id);
      const { defibrillator } = res.data;
      setCurrDef(defibrillator);
    };

    fetchData();

    return () => {
      currDefCancelToken.cancel();
    };
  }, [id]);

  return currDef ? (
    <div className={classes.popupContainer}>
      {currDef.images[0] && (
        <img
          title={currDef.images[0].filename}
          className={classes.imagePreview}
          src={`http://localhost:3000/api/images/${currDef.images[0].filename}`}
          alt={currDef.images[0].filename}
        />
      )}

      {Object.keys(titles).map(key => {
        return (
          currDef[key] !== undefined && (
            <p key={key}>
              <span className={classes.title}>
                {titles[key]}
              </span>
              <br />
              {formatData(key, currDef)}
            </p>
          )
        );
      })}
      <div 
        className={classes.routeIconContainer}
        onClick={handleRoute}
      >
        <DirectionsIcon className={classes.routeIcon}/>
      </div>
      <Cancel
        className={classes.closeBtn}
        onClick={hidePopup}
      />
      <ModalPhoto images={currDef.images} />
    </div>
  ) : (
    <Loader />
  );
};

DefibrillatorPopupContent.propTypes = {
  id: PropTypes.string.isRequired,
  hidePopup: PropTypes.func.isRequired,
  setRoutePosition: PropTypes.func
};

export default connect(null, dispatch => ({
  hidePopup: () => dispatch(hidePopup()),
  setRoutePosition: ( routeCoords, id ) =>
    dispatch(setRoutePosition( routeCoords, id ))
}))(DefibrillatorPopupContent);
