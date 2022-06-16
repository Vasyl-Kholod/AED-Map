import { isFunction } from 'lodash';
import { useQuery } from "react-query"
import { useDispatch, useSelector } from "react-redux"

import { getDirections } from "shared/api/map";
import { setMapCenter, setMapZoom } from "shared/store/map/actions";

const useGetDirections = (oQueriesOpts = {}) => {
    const dispatch = useDispatch();
    const userPosition = useSelector(state => state.userPosition.coords);
    const { endCoordinates, transportType } = useSelector(state => state.mapState.routeDetails);

    return useQuery([transportType, userPosition, endCoordinates],
        ({ queryKey }) => getDirections(
            queryKey[0],
            queryKey[1],
            queryKey[2],
        ),
        {
            ...oQueriesOpts,
            onSettled: () => {
                if (isFunction(oQueriesOpts.onSettled)) {
                    oQueriesOpts.onSettled();
                }
            },
            onSuccess: (oResponse) => {
                if (!!endCoordinates.lng) {
                    dispatch(setMapCenter({
                        lng: endCoordinates.lng,
                        lat: endCoordinates.lat
                    }))
                    dispatch(setMapZoom(13.5))

                    if (isFunction(oQueriesOpts.onSuccess)) {
                        oQueriesOpts.onSuccess(oResponse)
                    }
                }
            },
            onError: () => {
                if (isFunction(oQueriesOpts.onError)) {
                    oQueriesOpts.onError();
                }
            },
        },
    )
}

export { useGetDirections }


// return useQuery([transportType, userPosition, endCoordinates],
//     async ({ queryKey }) => {
//         if (!!endCoordinates.lng) {
//             dispatch(setMapCenter({
//                 lng: endCoordinates.lng,
//                 lat: endCoordinates.lat
//             }));
//             dispatch(setMapZoom(13.5));

//             const res = await getDirections(
//                 queryKey[0],
//                 queryKey[1],
//                 queryKey[2],
//             );

//             return res.routes[0]
//         }
//     },
//     { ...oQueriesOpts },
// )