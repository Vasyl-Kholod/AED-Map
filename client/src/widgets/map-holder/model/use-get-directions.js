import { isFunction } from 'lodash';
import { useMutation } from "react-query"
import { useDispatch, useSelector } from "react-redux"

import { getDirections } from "shared/api/map";
import { setMapCenter, setMapZoom } from "shared/store/map/actions";

const useGetDirections = (oMutationsOpts = {}) => {
    const dispatch = useDispatch();
    const { endCoordinates } = useSelector(state => state.mapState.routeDetails);

    return useMutation(
        ({ transportType, userCoords, endCoords }) => getDirections(transportType, userCoords, endCoords),
        {
            ...oMutationsOpts,
            onMutate: () => {
                if (isFunction(oMutationsOpts.onMutate)) {
                    oMutationsOpts.onMutate();
                }
            },
            onSuccess: (oResponse) => {
                dispatch(setMapCenter({
                    lng: endCoordinates.lng,
                    lat: endCoordinates.lat
                }))
                dispatch(setMapZoom(16))
                if (isFunction(oMutationsOpts.onSuccess)) {
                    oMutationsOpts.onSuccess(oResponse)
                }
            },
            onError: () => {
                if (isFunction(oMutationsOpts.onError)) {
                    oMutationsOpts.onError();
                }
            },
        },
    )
}

export { useGetDirections }