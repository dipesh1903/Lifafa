import { User } from "firebase/auth"
import { AuthActions, AuthReduxAction } from "./actionCreator";
import storePersist, { LOCAL_STORAGE_KEY } from "../storePersist";


export type AuthInitialStateType = {
    user: User | Record<PropertyKey, never>;
    isFirebaseAuthenticated: boolean,
    isAnonymousUser: boolean
} | Record<PropertyKey, never>;

export const initialState: AuthInitialStateType = storePersist.get(LOCAL_STORAGE_KEY.LOGIN_DETAILS) || {
    user: {},
    isFirebaseAuthenticated: false,
    isAnonymousUser: false 
};

export function AuthReducer(initState: AuthInitialStateType, action: AuthReduxAction): AuthInitialStateType {
    
    switch(action.type) {
        case AuthActions.LOGIN:
            const loginDetails = {...initState,
                ...action.payload
            } as AuthInitialStateType;
            storePersist.set(LOCAL_STORAGE_KEY.LOGIN_DETAILS, loginDetails)
            return loginDetails;
        case AuthActions.LOGOUT:
            storePersist.remove(LOCAL_STORAGE_KEY.LOGIN_DETAILS);
            return {...initState, user: {}} as AuthInitialStateType;
        case AuthActions.FIREBASE_AUTHENTICATED:
            const detail = {
                ...initState, isFirebaseAuthenticated: action.payload.isAuthenticated
            } as AuthInitialStateType;
            storePersist.set(LOCAL_STORAGE_KEY.LOGIN_DETAILS, detail)
            return detail;
        default:
            return initState;
    }
}