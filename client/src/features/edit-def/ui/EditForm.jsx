import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useHistory } from 'react-router-dom';
import { useGetSingleDef } from 'shared/hooks/use-get-single-user';
import { useEditDef } from 'features/edit-def/model/use-edit-def';
import { getReverseGeocoding } from 'shared/api/gmap';
import { setMapCenter } from 'shared/store/map/actions';

import MyForm from 'shared/ui/Form';
import Loader from 'shared/ui/Loader';

import { useLoaderStyles } from '../model/use-styles';

const EditForm = ({ setMapCenter }) => {
  const classes = useLoaderStyles();
  const [def, setDef] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  
  const { href } = window.location;
  const id = href.slice(href.lastIndexOf('/') + 1);

  const {
    mutate
  } = useEditDef();

  const prepareData = async (defibrillator) => {
    const [lng, lat] = defibrillator.location.coordinates;
    const correctAddress = await getReverseGeocoding({
      lng,
      lat
    });

    setDef({
      title: defibrillator.title,
      address:
        correctAddress.results[0] &&
        correctAddress.results[0].formatted_address,
      informational_plates:
        defibrillator.informational_plates,
      phone: defibrillator.phone,
      language: defibrillator.language,
      additional_information:
        defibrillator.additional_information,
      floor: defibrillator.storage_place.match(/\d/)[0],
      storage_place: defibrillator.storage_place.match(
        /, (.*)/
      )[1],
      coordinates: defibrillator.location.coordinates,
      availableFrom: defibrillator.availableFrom,
      images: defibrillator.images
    });
    setMapCenter({ lng, lat, zoom: 17 });
  };

  const {
    isError
  } = useGetSingleDef( id, {
    onSuccess: async (defData) => {
      await prepareData(defData.defibrillator)
      setIsLoading(false)
    },
    onError: () => {
      history.push('/')
    }
  });

  const hadleSubmit = async ({ images, ...data }) => {
    const editedDef = {
      ...data,
      _id: id,
      actual_date: data.actualDate,
      location: {
        type: 'Point',
        coordinates: data.coordinates
      },
      storage_place: `Поверх ${data.floor}, ${data.storage_place}`
    };

    const ImageFormData = new FormData();
    Object.values(images).forEach(image =>
      ImageFormData.append('images', image)
    );

    mutate({ editedDef, ImageFormData })
  };

  return !isLoading && !isError ? (
    <MyForm
      INITIAL_VALUES={def}
      submitAction={hadleSubmit}
      successAlertMessage='Успішно відредаговано!'
    />
  ) : (
    <div className={classes.loader}>
      <Loader />
    </div>
  );
};

EditForm.propTypes = {
  setMapCenter: PropTypes.func.isRequired
};

export default connect(null, dispatch => ({
  setMapCenter: newPoint => dispatch(setMapCenter(newPoint))
}))(EditForm);
