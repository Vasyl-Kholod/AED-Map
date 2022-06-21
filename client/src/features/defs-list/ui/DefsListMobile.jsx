import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from 'react-virtualized';

import { useGetDefsList } from '../model/use-get-defs';
import { BASE_ZOOM_VALUE } from 'shared/store/defs/constants';
import {
  setMapZoom,
  setMapCenter
} from 'shared/store/map/actions';

import { isEmpty } from 'lodash';
import { DefItem } from 'features/def-item';
import { InfoMessage } from 'features/map-info-message';
import HorizontalLoader from 'shared/ui/Loader/HorizontalLoader';

import { useItemsListMobileStyles } from '../model/use-styles';

const DefsListMobile = ({
  activeDef,
  setMapCenterCoords,
  setMapZoomParam
}) => {
  const classes = useItemsListMobileStyles();

  const {
    data: defibrillators,
    isFetching,
    hasNextPage,
    fetchNextPage
  } = useGetDefsList();

  const noData = !isFetching && isEmpty(defibrillators);
  const showMessage =
    (isFetching && isEmpty(defibrillators)) || noData;
  const showHorizontalLoader =
    isFetching && !isEmpty(defibrillators);

  let message;
  switch (true) {
    case isFetching:
      message = 'Завантаження...';
      break;
    case noData:
      message = 'Даних не знайдено...';
      break;
    default:
      message = '';
  }

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
  });

  const handleScroll = event => {
    const { scrollHeight, scrollTop, clientHeight } = event;

    if (
      hasNextPage &&
      scrollHeight - Math.ceil(scrollTop) <= clientHeight
    ) {
      fetchNextPage();
    }
  };

  // eslint-disable-next-line react/prop-types
  const rowRenderer = ({ key, index, style, parent }) => {
    return (
      <CellMeasurer //  dynamically calculates the height of every item
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <DefItem
          styleParam={style}
          defItemInfo={defibrillators[index]}
        />
      </CellMeasurer>
    );
  };

  useEffect(() => {
    if (activeDef) {
      const [lng, lat] = activeDef.location.coordinates;
      setMapCenterCoords({
        lng,
        lat
      });
      setMapZoomParam(BASE_ZOOM_VALUE);
    }
    // eslint-disable-next-line
  }, [activeDef]);

  return (
    <div className={classes.listOuterStyle}>
      <AutoSizer>
        {({ width, height }) => {
          //  AutoSizer expands list to width and height of parent automatically
          return (
            <List
              onScroll={handleScroll}
              className={classes.listStyle}
              width={width}
              height={height}
              deferredMeasurementCache={cache}
              rowCount={defibrillators.length}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
              overscanRowCount={10}
            />
          );
        }}
      </AutoSizer>
      {showMessage && <InfoMessage>{message}</InfoMessage>}
      {showHorizontalLoader && <HorizontalLoader />}
    </div>
  );
};

DefsListMobile.defaultProps = {
  activeDef: null,
  setMapCenterCoords: () => null,
  setMapZoomParam: () => null,
  fetchDefItems: () => null,
  filter: null,
  user: null
};

DefsListMobile.propTypes = {
  activeDef: PropTypes.oneOfType([PropTypes.object]),
  filter: PropTypes.oneOfType([PropTypes.object]),
  search: PropTypes.shape({
    address: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  }),
  setMapCenterCoords: PropTypes.func,
  setMapZoomParam: PropTypes.func
};

export default connect(
  state => ({
    filter: state.filter,
    activeDef: state.defs.listData.find(
      def => def._id === state.defs.active
    ),
    search: state.search,
    user: state.user.user
  }),
  dispatch => ({
    setMapCenterCoords: mapState =>
      dispatch(setMapCenter(mapState)),
    setMapZoomParam: mapState =>
      dispatch(setMapZoom(mapState))
  })
)(DefsListMobile);
