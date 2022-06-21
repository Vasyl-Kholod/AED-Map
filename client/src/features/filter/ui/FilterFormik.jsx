import React, { useEffect } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  setFilter,
  resetFilter
} from 'shared/store/filter/actions';
import FilterSchema from 'features/filter/model/validator';
import { INITIAL_VALUES } from 'features/filter/lib/constants';
import { useFilterFormikStyles } from 'features/filter/model/use-styles';

import { hidePopup } from 'shared/store/popup/actions';

import FormFormik from './FormFormik';
import FilterHeader from './FilterFormHeader';

const FilterFormik = ({
  filter,
  popupData,
  setIsOpen,
  hidePopup,
  setFilterValue,
  resetFilterValue
}) => {
  const classes = useFilterFormikStyles();
  const initialValues = { ...INITIAL_VALUES, ...filter };

  const onSubmit = async (values, { setSubmitting }) => {
    if (popupData) {
      hidePopup();
    }

    if (
      filter &&
      Object.values(values).every(value => !value)
    ) {
      resetFilterValue();
    } else {
      setFilterValue(values);
    }

    setSubmitting(false);
  };

  useEffect(() => {
    const handleClick = ({ target }) => {
      if (target.tagName === 'CANVAS') {
        setIsOpen(false);
      }
    };

    const handleKeyDown = ({ code }) => {
      if (code === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  });

  return (
    <div className={classes.container}>
      <FilterHeader />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={FilterSchema}
        enableReinitialize
      >
        {formik => (
          <FormFormik onSubmit={formik.handleSubmit} />
        )}
      </Formik>
    </div>
  );
};

FilterFormik.defaultProps = {
  filter: null,
  popupData: null
};
FilterFormik.propTypes = {
  filter: PropTypes.oneOfType([PropTypes.object]),
  popupData: PropTypes.oneOfType([PropTypes.object]),
  setFilterValue: PropTypes.func.isRequired,
  resetFilterValue: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  hidePopup: PropTypes.func.isRequired
};

export default connect(
  state => ({
    filter: state.filter,
    popupData: state.popupData
  }),
  {
    setFilterValue: setFilter,
    resetFilterValue: resetFilter,
    hidePopup
  }
)(FilterFormik);
