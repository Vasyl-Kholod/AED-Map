import React from 'react';

import { useAddDef } from '../model/use-add-def';
import MyForm from 'shared/ui/Form';

import INITIAL_VALUES from '../lib/constants';

const AddDefForm = () => {
  const {
    mutate
  } = useAddDef();
  const hadleSubmit = async ({ images, ...data }) => {
    const newDef = {
      ...data,
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

    mutate({ newDef, ImageFormData });
  };

  return (
    <MyForm
      INITIAL_VALUES={INITIAL_VALUES}
      submitAction={hadleSubmit}
      successAlertMessage='Додавання пройшло успішно'
    />
  );
};

export default AddDefForm;
