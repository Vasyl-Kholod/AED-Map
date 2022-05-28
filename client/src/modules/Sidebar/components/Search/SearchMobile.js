import React from 'react';
import { Formik } from 'formik';
import { DebounceInput } from 'react-debounce-input';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { MyInputBase } from 'shared/ui/Fields';

import { INITIAL_VALUES } from './consts';
import { useSearchDevices } from 'modules/Sidebar/hook';

const useStyles = makeStyles(() => ({
  searchWrapper: {
    marginBottom: 28,
    marginLeft: 30,
    marginRight: 10,
    width: '90%'
  },
  searchInput: {
    width: '100%',
    paddingRight: '0.5rem',
    paddingLeft: '16px',
    height: 48
  }
}));

export default function SearchMobile() {
  const classes = useStyles();
  const { address, onSearch } = useSearchDevices();

  return (
    <div className={classes.searchWrapper}>
      <Paper>
        <Formik initialValues={INITIAL_VALUES}>
          <DebounceInput
            element={MyInputBase}
            id="search"
            placeholder="Введіть адресу"
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