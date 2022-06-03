import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { IconButton, TextField } from "@material-ui/core"

import SearchNearestDefButton from '../SearchNearestDefButton';

import ClearIcon from '../../../../shared/icons/icons8-clear.svg'

import { getGeocodingOptions, getGeocodingDetails } from 'shared/api';
import { setUserPosition, inputUserPosition } from '../../actions/userPosition';
import { setMapCenter } from '../../actions/mapState'
import { useDefibrillatorAlert } from '../../hooks'

import { useStyles } from './use-styles'

export default function SearchUserPosition({ currentLocation, closeRouteDetails }) {
    const classes = useStyles();

    const [options, setOptions] = useState([]);

    const dispatch = useDispatch();
    const userLocationValue = useSelector(state => state.userPosition.userLocation);

    const { showChangePositionAlert } = useDefibrillatorAlert();

    const onChange = async ({ target: { value } }) => {
        dispatch(inputUserPosition(value))
        if (value.trim()) {
            const countries = await getGeocodingOptions(value);
            setOptions(countries.data.predictions);
        }
    }

    const SelectOption = async (_, selectedOption) => {
        if (selectedOption != null) {
            const response = await getGeocodingDetails(
                selectedOption.place_id
            );
            const coordinates =
                response.data.result.geometry
                    .location;

            dispatch(inputUserPosition(selectedOption.description))
            if (isEmpty(coordinates)) {
                showChangePositionAlert()
                return;
            }

            closeRouteDetails();

            dispatch(setUserPosition(coordinates));
            dispatch(setMapCenter(coordinates));
        }
    };

    return (
        <div className={classes.contentSearchBox}>
            <Autocomplete
                id="search_positon"
                className={classes.Autocomplete}
                classes={{ root: classes.root, inputRoot: classes.root, clearIndicatorDirty: classes.clearIndicator }}
                inputValue={userLocationValue}
                options={options}
                getOptionLabel={(option) => option.description}
                getOptionSelected={(option, value) => option === value}
                onChange={SelectOption}
                renderInput={(params) =>
                    <div className={classes.content}>
                        <TextField
                            {...params}
                            className={classes.inputStyle}
                            onChange={onChange}
                            placeholder="Введіть ваше місцезнаходження" />

                        {userLocationValue.trim() &&
                            <IconButton className={classes.contentClearIcon} onClick={currentLocation}>
                                <img width={15} height={15} src={ClearIcon} />
                            </IconButton>
                        }
                    </div>
                }
            />

            <SearchNearestDefButton />
        </div>
    )
}