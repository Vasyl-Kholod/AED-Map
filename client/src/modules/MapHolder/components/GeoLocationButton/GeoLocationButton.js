import React from 'react';
import PropTypes from 'prop-types';

const getLocationButton = {
    width: '35px',
    height: '35px',
    cursor: 'pointer',
    backgroundColor: 'white',
    borderRadius: '25%',
    border: '2px solid rgba(0, 0, 0, 0.6)',
    transform: [{ rotate: '90deg' }],
}

function GeoLocationButton({ currentLocation }) {
    return (
        <img
            style={getLocationButton}
            onClick={currentLocation}
            src="https://img.icons8.com/ios/50/000000/east-direction.png"
            alt='search' />
    )
}

GeoLocationButton.propTypes = {
    currentLocation: PropTypes.func
}

export default GeoLocationButton;
