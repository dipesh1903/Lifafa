import { LifafaFE, SharedUserFE } from "../../types/documentFETypes";
import { UserAccessActions, UserAccessReduxAction} from "../UsersAccess/actionCreator";
import { LifafaActions, LifafaReduxAction } from "./actionCreator";
import { LifafaContextDataType } from "./context";

export const initialState: LifafaContextDataType = {
    isFetching: false,
    data: {},
    isAllLoaded: false
};

export function lifafaReducer(lifafas: LifafaContextDataType, action: LifafaReduxAction | UserAccessReduxAction)
: LifafaContextDataType {
    switch(action.type) {
        case LifafaActions.CREATE: {
            const { lifafa } = action.payload;
            const res: LifafaContextDataType  = {...lifafas, isFetching: false}
            res.data[lifafa.id] = {
                lifafa,
                userAccess: {...res.data[lifafa.id]?.userAccess}
            }
            return res;
        }

        case LifafaActions.UPDATE: {
            const { lifafa, lifafaId } = action.payload;
            const res: LifafaContextDataType  = {...lifafas, isFetching: false}
            res.data[lifafaId] = {
                lifafa: {...(res.data[lifafaId]?.lifafa || {}), ...(lifafa as LifafaFE)},
                userAccess: {...res.data[lifafaId]?.userAccess}

            }
            return res;
        }

        case LifafaActions.FETCH_ALL: {
            
            const { lifafa } = action.payload
            const result = {} as {[x: string]: {lifafa: LifafaFE , userAccess: {[y: string]: SharedUserFE}}};
            lifafa.forEach((item: LifafaFE) => result[item.id] = {lifafa: item, userAccess: {
                ...(lifafas.data[item.id]?.userAccess || null)
            } as {[y: string]: SharedUserFE}});
            const res: LifafaContextDataType  = {...lifafas, isFetching: false, isAllLoaded: true}
            res.data = {...res.data, ...result};
            return res;
        }

        case LifafaActions.FETCH_SINGLE: {
            
            const { lifafa, access } = action.payload
            const res: LifafaContextDataType  = {...lifafas, isFetching: false }
            res.data = {...res.data, [lifafa.id]: {
                lifafa,
                userAccess: {
                    ...(res.data[lifafa.id]?.userAccess || {}),
                    [access.id]: access
                }
            }};
            return res;
        }

        case LifafaActions.DELETE: {
            const { lifafaId } = action.payload;
            const res = {...lifafas};
            if (res.data[lifafaId]) {
                delete res.data[lifafaId]
            }
            return {
                ...res,
                isFetching: false
            }
        }

        case LifafaActions.ACTION_STARTED: {
            return {
                ...lifafas,
                isFetching: true
            }
        }


        case LifafaActions.ACTION_FAILED: {
            return {
                ...lifafas,
                isFetching: false
            }
        }
        case UserAccessActions.CREATE: {
            const { user, lifafaId } = action.payload;
            const res = {...lifafas, isFetching: false} as LifafaContextDataType;
            res.data[lifafaId] = {
                lifafa: res.data[lifafaId]?.lifafa as LifafaFE,
                userAccess: {...(res.data[lifafaId]?.userAccess || {}), 
                [user.id]: user as SharedUserFE}
                }
            return res;
        }

        case UserAccessActions.FETCH_SINGLE: {
            
            const { lifafaId, users } = action.payload;
            return {
                ...lifafas,
                isFetching: false,
                data: {
                    ...lifafas.data,
                    [lifafaId]: {
                        lifafa: lifafas?.data[lifafaId]?.lifafa || null,
                        userAccess: {
                            ...((lifafas.data[lifafaId] && lifafas.data[lifafaId]?.userAccess)),
                            [users.id]: users
                        }
                    }
                }

            }
        }

        case UserAccessActions.FETCH_ALL: {
            const result = {} as {[x: string]: SharedUserFE};
            const { lifafaId, users }= action.payload;
            
            (users || []).forEach((item: SharedUserFE) => result[item.id] = item);
            return {
                ...lifafas,
                isFetching: false,
                data: {
                    ...lifafas.data,
                    [lifafaId]: {
                        lifafa: lifafas.data[lifafaId]?.lifafa || null,
                        userAccess: {
                            ...((lifafas.data[lifafaId] && lifafas.data[lifafaId].userAccess) || {}),
                            ...result
                        }
                    }
                }

            }
        }

        case UserAccessActions.ACTION_STARTED: {
            return {
                ...lifafas,
                isFetching: true
            }
        }


        case UserAccessActions.ACTION_FAILED: {
            return {
                ...lifafas,
                isFetching: false
            }
        }
        default:
            return lifafas;
    };
}