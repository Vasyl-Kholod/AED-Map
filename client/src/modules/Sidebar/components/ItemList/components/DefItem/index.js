import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink, useHistory } from 'react-router-dom';

import ConfirmationModalWrapper from 'shared/ui/ConfirmationModalWrapper';

import permissionService from '../../../../../Auth/permissionService';
import { fetchSingleDefById } from '../../../../../Sidebar/api/index';
import {
  setFullTime,
  setFromTime,
  setUntilTime
} from '../../../EditForm/actions/setFullTime';
import {
  setMapCenter,
  setMapZoom,
  setDefIndex,
  setRoutePosition,
  setNextNearestDefButtonStatus
} from '../../../../../MapHolder/actions/mapState';
import {
  deleteDefItem,
  blockDefItem,
  setActive,
} from '../../actions/list';
import {
  ENTER_BUTTON_CODE,
  BASE_ZOOM_VALUE,
  EDIT_DEF_POINT,
  DELETE_DEF_POINT,
  BLOCK_DEF_POINT
} from '../../consts';
import BlockBtn from './BlockBtn';
import DeleteBtn from './DeleteBtn';
import DirectionsIcon from '@material-ui/icons/Directions';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
  pointCard: {
    position: 'relative',
    minHeight: 100,
    '&:not(:last-of-type)': {
      borderBottom: '1px solid #fff',
      padding: 0
    },
    textDecoration: 'none',
    background: props =>
      props.isActive ? '#344870' : '#282c34',
    overflow: 'hidden',
    '&:hover': {
      background: '#686c7458',
      cursor: 'pointer'
    }
  },
  pointCardInfo: {
    padding: 15,
    outline: 'none'
  },
  pointCardButtons: {
    padding: props => (props.hasPermission ? 15 : 0),

    display: 'flex',
    height: props => (props.hasPermission ? 60 : 0),

    '& a': {
      textDecoration: 'none'
    }
  },
  titleStyle: {
    color: '#fff',
    fontSize: 17,
    marginBottom: 10
  },
  descStyle: {
    color: '#bbb',
    fontSize: 13
  },
  routeIconContainer: {
    display: props => (props.isActive ? 'block' : 'none'),
    position: 'absolute',
    bottom: '5px',
    right: '6px',
  },
  routeIcon: {
    fontSize: '40px',
    color: '#696969',
    '&:hover': {
      color: '#1976d2'
    }
  }
});
const DefItem = ({
  makeItemActive,
  activeItemId,
  defItemInfo,
  index,
  setMapCenterCoords,
  setMapZoomParam,
  setRoutePosition,
  // eslint-disable-next-line react/prop-types
  style,
  deleteDefibrPoint,
  blockDefibrPoint,
  user,
  setTime,
  setFromTime,
  setUntilTime,
  setDefIndex,
  setNextNearestDefButtonStatus,
}) => {
  const isActive = defItemInfo._id === activeItemId;
  const hasPermission =
    user &&
    (user.role === 'Admin' ||
      user._id === defItemInfo.owner);
  const classes = useStyles({ isActive, hasPermission });
  const [lng, lat] = defItemInfo.location.coordinates;
  const [
    permissionForEdit,
    changePermissionForEdit
  ] = useState(false);
  const [
    permissionForDelete,
    changePermissionForDelete
  ] = useState(false);
  const [
    permissionForBlockDef,
    changePermissionForBlockDef
  ] = useState(false);
  const history = useHistory();

  const handleClick = () => {
    makeItemActive(defItemInfo._id);
    setMapCenterCoords({
      lng,
      lat
    });
    setMapZoomParam(BASE_ZOOM_VALUE);
  };

  const handleEditClick = event => {
    event.preventDefault();
    setNextNearestDefButtonStatus(false);
    setDefCheckbox(defItemInfo._id);
    history.push(`/edit-form/${defItemInfo._id}`);
  };

  const setDefCheckbox = async id => {
    const res = await fetchSingleDefById(id);
    const data = res.data.defibrillator;
    setTime(data.fullTimeAvailable);
    const timeFrom =
      data.availableFrom === undefined ||
        data.availableFrom === null
        ? 0
        : data.availableFrom;
    setFromTime(timeFrom);
    const timeUntil =
      data.availableUntil === undefined ||
        data.availableUntil === null
        ? 23
        : data.availableUntil;
    setUntilTime(timeUntil);
  };

  const handleKeyDown = event => {
    if (event.keyCode === ENTER_BUTTON_CODE) {
      setMapCenterCoords({
        lng,
        lat
      });
    }
  };

  const handleRoute = () => {
    const [lng, lat] = defItemInfo.location.coordinates;
    const { _id: id } = defItemInfo
    setRoutePosition({ lng, lat }, id)
    setDefIndex(index);
    setNextNearestDefButtonStatus(true);
  }

  useEffect(() => {
    const permissionEdit = permissionService(
      EDIT_DEF_POINT,
      user,
      defItemInfo
    );
    const permissionDelete = permissionService(
      DELETE_DEF_POINT,
      user,
      defItemInfo
    );
    const permissionBlockDef = permissionService(
      BLOCK_DEF_POINT,
      user
    );
    changePermissionForEdit(permissionEdit);
    changePermissionForDelete(permissionDelete);
    changePermissionForBlockDef(permissionBlockDef);
    // eslint-disable-next-line
  }, [user]);

  return (
    <NavLink
      to={`?id=${defItemInfo._id}`}
      className={classes.pointCard}
      style={style}
    >
      <div
        className={classes.pointCardInfo}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <h3 className={classes.titleStyle}>
          {defItemInfo.title}
        </h3>
        <p className={classes.descStyle}>
          {defItemInfo.address}
        </p>
      </div>
      <div className={classes.pointCardButtons}>
        {permissionForEdit && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleEditClick}
          >
            Редагувати
          </Button>
        )}
        {permissionForDelete && (
          <ConfirmationModalWrapper
            ButtonOpen={DeleteBtn}
            confirmHandle={() =>
              deleteDefibrPoint(defItemInfo._id)
            }
            message="Видалити дефібрилятор?"
            messageAlert="Дефібрилятор успішно видалено"
          />
        )}
        {permissionForBlockDef && (
          <ConfirmationModalWrapper
            ButtonOpen={({ handleOpen }) => (
              <BlockBtn
                handleOpen={handleOpen}
                blocked={defItemInfo.blocked}
              />
            )}
            confirmHandle={() =>
              blockDefibrPoint(
                defItemInfo._id,
                !defItemInfo.blocked
              )
            }
            message={
              defItemInfo.blocked
                ? 'Розблокувати дефібрилятор?'
                : 'Заблокувати дефібрилятор?'
            }
            messageAlert={
              defItemInfo.blocked
                ? 'Дефібрилятор розблоковано'
                : 'Дефібрилятор заблоковано'
            }
          />
        )}
      </div>
      <div
        className={classes.routeIconContainer}
      >
        <Tooltip
          title="Прокласти шлях"
          onClick={handleRoute}
        >
          <DirectionsIcon className={classes.routeIcon}/>
        </Tooltip>
      </div>
    </NavLink>
  );
};

DefItem.defaultProps = {
  defItemInfo: {},
  activeItemId: () => null,
  setMapCenterCoords: () => null,
  setMapZoomParam: () => null,
  deleteDefibrPoint: () => null,
  blockDefibrPoint: () => null,
  user: null
};

DefItem.propTypes = {
  defItemInfo: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    address: PropTypes.string,
    location: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number)
    }),
    actual_date: PropTypes.string,
    floor: PropTypes.number,
    storage_place: PropTypes.string,
    availableFrom: PropTypes.string,
    language: PropTypes.string,
    informational_plates: PropTypes.string,
    phone: PropTypes.arrayOf(PropTypes.string),
    additional_information: PropTypes.string,
    blocked: PropTypes.bool,
    owner: PropTypes.string
  }),
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  }),
  setMapCenterCoords: PropTypes.func,
  setMapZoomParam: PropTypes.func,
  deleteDefibrPoint: PropTypes.func,
  blockDefibrPoint: PropTypes.func,
  activeItemId: PropTypes.string,
  makeItemActive: PropTypes.func.isRequired,
  setRoutePosition: PropTypes.func
};

export default connect(
  state => ({
    user: state.user.user,
    activeItemId: state.defs.active,
    mapData: state.defs.mapData
  }),
  dispatch => ({
    makeItemActive: itemId => dispatch(setActive(itemId)),
    setMapCenterCoords: mapState =>
      dispatch(setMapCenter(mapState)),
    setMapZoomParam: mapState =>
      dispatch(setMapZoom(mapState)),
    deleteDefibrPoint: id => dispatch(deleteDefItem(id)),
    blockDefibrPoint: (id, blocked) =>
      dispatch(blockDefItem(id, blocked)),
    setTime: value => dispatch(setFullTime(value)),
    setFromTime: time => dispatch(setFromTime(time)),
    setUntilTime: time => dispatch(setUntilTime(time)),
    setRoutePosition: (routeCoords, id) =>
      dispatch(setRoutePosition(routeCoords, id)),
    setDefIndex: value => dispatch(setDefIndex(value)),
    setNextNearestDefButtonStatus: (value) => dispatch(setNextNearestDefButtonStatus(value))
  })
)(DefItem);
