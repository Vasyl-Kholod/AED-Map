import { get, isEmpty } from 'lodash';
import { getNearestDevices } from '../../Sidebar/api';

const emptyFn = () => null;

const defaultTransformFn = oResponse =>
    get(oResponse, ['data', 'listDefs'], {});

const getNearestDefibrillatorsFn = ({
    urlParams,
    geolocationProvided,
    showDevicesAlert,
    showPositionAlert,
    onDataSuccess = emptyFn,
    onDevicesError = emptyFn,
    onPositionError = emptyFn,
    onGetDataSuccess = emptyFn,
    onStartGettingValues = emptyFn,
    transformFn = defaultTransformFn
}) => async () => {
    onStartGettingValues();

    if (geolocationProvided) {
        try {
            const oResponse = await getNearestDevices(urlParams);
            const oNearestItem = transformFn(oResponse);

            if (!isEmpty(oNearestItem)) {
                onGetDataSuccess();

                const { _id: id, location } = oNearestItem || {};
                const [lng, lat] = location?.coordinates || [];

                onDataSuccess({ lng, lat }, id);
            } else {
                onDevicesError();
                showDevicesAlert();
            }
        } catch {
            onDevicesError();
            showDevicesAlert();
        }
    } else {
        onPositionError();
        showPositionAlert();
    }
};

export { defaultTransformFn, getNearestDefibrillatorsFn };