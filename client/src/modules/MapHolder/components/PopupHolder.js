import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Popup } from 'react-mapbox-gl';
import { makeStyles } from '@material-ui/core'

import DefContent from './PopupContent/DefibrillatorPopupContent';
import { popupOffsets } from '../consts';

const useStyles = makeStyles({
  popupHolderContent: {
    willChange: 'auto !important'
  }
})

const PopupHolder = ({ popupData }) => {
  const classes = useStyles();

  return (
    <>
      {popupData && (
        <Popup
          className={classes.popupHolderContent}
          coordinates={popupData.coordinates}
          offset={popupOffsets}
        >
          <DefContent id={popupData.data.id} />
        </Popup>
      )}
    </>
  );
};

PopupHolder.defaultProps = {
  popupData: null
};

PopupHolder.propTypes = {
  popupData: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string
    }),
    coordinates: PropTypes.arrayOf(PropTypes.number)
  })
};

export default connect(state => ({
  popupData: state.popupData
}))(PopupHolder);
