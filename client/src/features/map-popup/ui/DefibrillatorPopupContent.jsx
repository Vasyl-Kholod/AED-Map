import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import { Cancel } from '@material-ui/icons';

import { useGetSingleDef } from 'shared/hooks/use-get-single-user';
import {
  setDefIndex,
  setRoutePosition
} from 'shared/store/map/actions';

import Loader from 'shared/ui/Loader';
import { ModalPhoto } from 'widgets/photo-gallery';

import { titles } from '../lib/title-constants';
import { hidePopup } from 'shared/store/popup/actions';

import { useDefPopupContentStyles } from '../model/use-styles';
import { BASE_URL } from 'shared/consts/url';

const DefibrillatorPopupContent = ({ id, hidePopup }) => {
  const classes = useDefPopupContentStyles();
  const [currDef, setCurrDef] = useState(null);

  const {
    data: defItem
  } = useGetSingleDef(id, {
    onSuccess: ({defibrillator}) => {
      setCurrDef(defibrillator);
    }
  });

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
          ? 'Цілодобово'
          : `${def.availableFrom
              .toString()
              .padStart(2, '0')}:00 - 
             ${def.availableUntil
               .toString()
               .padStart(2, '0')}:00`;
      return `${availableTime}, доступно ${def.defs_amount}`;
    }

    return def[key];
  };

  return currDef ? (
    <div className={classes.popupContainer}>
      {currDef.images[0] && (
        <img
          title={currDef.images[0].filename}
          className={classes.imagePreview}
          src={`${BASE_URL}/api/images/${currDef.images[0].filename}`}
          alt={currDef.images[0].filename}
        />
      )}

      {Object.keys(titles).map(key =>
        !isEmpty(currDef[key]) ||
        isEqual(key, 'availableFrom') ? (
          <p key={key}>
            <span className={classes.title}>
              {titles[key]}
            </span>
            <br />
            {formatData(key, currDef)}
          </p>
        ) : null
      )}
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
  listData: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  hidePopup: PropTypes.func.isRequired,
  setRoutePosition: PropTypes.func
};

export default connect(
  state => ({
    listData: state.defs.listData
  }),
  dispatch => ({
    hidePopup: () => dispatch(hidePopup()),
    setRoutePosition: (routeCoords, id) =>
      dispatch(setRoutePosition(routeCoords, id)),
    setDefIndex: value => dispatch(setDefIndex(value))
  })
)(DefibrillatorPopupContent);
