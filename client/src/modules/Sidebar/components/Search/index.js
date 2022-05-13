import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Paper } from '@material-ui/core';
import { DebounceInput } from 'react-debounce-input';
import { makeStyles } from '@material-ui/core/styles';

import { MyInputBase } from 'shared/ui/Fields';

import { setSearch } from './actions';
import { INITIAL_VALUES } from './consts';
import {
  fetchDefs,
  setPage,
  setData
} from '../ItemList/actions/list';
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

const Search = ({
  setSearch,
  fetchDefItems,
  resetData,
  resetPage,
  search
}) => {
  const classes = useStyles();
  const verifyQuery = /[^A-Za-zА-Яа-я]|\d/;
  const onSearch = ({ target: { value } }) => {
    const resetPagination = (page, data) => {
      resetPage(page);
      resetData(data);
    };

    setSearch({ title: value, address: value });

    if (
      value.length >= 2 ||
      (value.length < 2 && verifyQuery.test(value))
    ) {
      resetPagination(1, []);
      fetchDefItems({ title: value, address: value });
    } else if (value.length < 2) {
      setSearch({ title: value, address: value });
      resetPagination(1, []);
      fetchDefItems();
    }
  };

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
            value={search.address}
          />
        </Formik>
      </Paper>
    </div>
  );
};

Search.propTypes = {
  search: PropTypes.shape({
    address: PropTypes.string.isRequired
  }).isRequired,
  setSearch: PropTypes.func.isRequired,
  fetchDefItems: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  resetPage: PropTypes.func.isRequired
};

export default connect(
  state => ({ search: state.search }),
  {
    setSearch: value => setSearch(value),
    fetchDefItems: params => fetchDefs(params),
    resetPage: page => setPage(page),
    resetData: data => setData(data)
  }
)(Search);
