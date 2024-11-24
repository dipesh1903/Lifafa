import { SharedUserFE } from "../../types/documentFETypes";
import { UserAccessActions, UserAccessCreate, UserAccessFetch, UserAccessReduxAction } from "./actionCreator";
import { UserAccessContextDataType } from "./context";

export const initialState: UserAccessContextDataType = {
    isFetching: false,
    data: {}
};

export function UserAccessReducer(users: UserAccessContextDataType, action: UserAccessReduxAction)
: UserAccessContextDataType {
    
    switch(action.type) {
        case UserAccessActions.CREATE: {
            const [user, lifafaId] = (action.payload as unknown) as UserAccessCreate;
            return {
                ...users,
                isFetching: false,
                data: {
                    ...users.data,
                    [lifafaId]: {
                        ...users.data[lifafaId],
                        [user.id]: user
                    }
                }
            };
        }

        case UserAccessActions.FETCH_ALL: {
            const [lifafaId, user] = (action.payload as unknown) as UserAccessFetch;
            const res = {} as {[x: string]: SharedUserFE};
            
            (user || []).forEach((item: SharedUserFE) => res[item.id] = item);
            return {
                ...users,
                isFetching: false,
                data: {
                    ...users.data,
                    [lifafaId]: {
                        ...users.data[lifafaId],
                        ...res
                    }
                }
            }
        }

        case UserAccessActions.ACTION_STARTED: {
            return {
                ...users,
                isFetching: true
            }
        }


        case UserAccessActions.ACTION_FAILED: {
            return {
                ...users,
                isFetching: false
            }
        }

        default:
            return users
    };
}