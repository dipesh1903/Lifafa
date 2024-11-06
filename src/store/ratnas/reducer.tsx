import { RatnaFE, ReducerAction } from "../../types/documentFETypes";
import { RatnaActions, RatnaCreate, RatnaDelete, RatnaFetch, RatnaReduxAction, RatnaReduxPayloadType, RatnaUpdate } from "./actionCreator";
import { RatnaContextDataType } from "./context";

export const initialState: RatnaContextDataType = {
    isFetching: false,
    data: {}
};

export function RatnaReducer(ratnas: RatnaContextDataType, action: RatnaReduxAction)
: RatnaContextDataType {
    switch(action.type) {
        case RatnaActions.CREATE: {
            const {ratna, lifafaId} = action.payload;
            return {
                ...ratnas,
                isFetching: false,
                data: {
                    ...ratnas.data,
                    [lifafaId]: {
                        ...ratnas.data[lifafaId],
                        [ratna.id]: ratna
                    }
                }
            };
        }
        case RatnaActions.UPDATE: {
            const {ratna,  lifafaId, ratnaId} = action.payload
            return {
                ...ratnas,
                isFetching: false,
                data: {
                    ...ratnas.data,
                    [lifafaId]: {
                        ...ratnas.data[lifafaId],
                        [ratnaId]: {
                            ...ratnas.data[lifafaId][ratnaId],
                            ...ratna
                        }
                    }
                }
            }
        }
        case RatnaActions.DELETE: {
            const {lifafaId, ratnaId} = action.payload
            const newRatnas = {...ratnas};
            if (newRatnas.data[lifafaId] && newRatnas.data[lifafaId][ratnaId]) {
                delete newRatnas.data[lifafaId][ratnaId];
                if (!Object.keys(newRatnas.data[lifafaId].length)) {
                    delete newRatnas.data[lifafaId]
                }
            }
            return {...newRatnas, isFetching: false }
        }

        case RatnaActions.FETCH_ALL: {
            const {lifafaId, ratnas: ratna} = action.payload;
            const res = {} as {[x: string]: RatnaFE};
            (ratna || []).forEach((item: RatnaFE) => res[item.id] = item);
            return {
                ...ratnas,
                isFetching: false,
                data: {
                    ...ratnas.data,
                    [lifafaId]: {
                        ...res
                    }
                }
            }
        }

        case RatnaActions.ACTION_STARTED: {
            return {
                ...ratnas,
                isFetching: true
            }
        }


        case RatnaActions.ACTION_FAILED: {
            return {
                ...ratnas,
                isFetching: false
            }
        }

        default:
            return ratnas
    };
}