import React from 'react';
import { Formik } from 'formik';
import { Paper } from '@material-ui/core';
import { DebounceInput } from 'react-debounce-input';
import { makeStyles } from '@material-ui/core/styles';

import { MyInputBase } from 'shared/ui/Fields';
import { useSearchDevices } from 'modules/Sidebar/hook';

import { INITIAL_VALUES } from './consts';

import Filter from './components/Filter';

const useStyles = makeStyles(() => ({
  searchWrapper: {
    marginBottom: 20
  },
  searchInput: {
    width: '100%',
    paddingRight: '0.5rem'
  }
}));

export default function Search() {
  const classes = useStyles();
  const { address, onSearch } = useSearchDevices();

  return (
    <div className={classes.searchWrapper}>
      <Paper>
        <Formik initialValues={INITIAL_VALUES}>
          <DebounceInput
            element={MyInputBase}
            startAdornment={<Filter />}
            id="search"
            placeholder="Впишіть сюди адресу"
            name="search"
            className={classes.searchInput}
            autoFocus
            debounceTimeout={300}
            onChange={onSearch}
            value={address}
          />
        </Formik>
      </Paper>
    </div>
  );
};