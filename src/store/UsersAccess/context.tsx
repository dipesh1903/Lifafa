import { createContext, ReactNode, Reducer, useContext, useReducer } from "react";
import { initialState, UserAccessReducer } from "./reducer";
import { SharedUserFE } from "../../types/documentFETypes";
import { UserAccessReduxAction } from "./actionCreator";
import { DispatcherThunk, useThunkReducer } from "../../utils/hooks/useReducerThunk";

export type UserAccessContextDataType = {
    data: {
        [x: string]: {
                [y: string]: SharedUserFE
            }
    },
    isFetching: boolean
}

const UserAccessContext = createContext<UserAccessContextDataType>({isFetching: true, data: {}});
const UserAccessContextDispatch = createContext({});

type UserAccessContextProps = {
    children: ReactNode,
}

export const UserAccessProvider = (props: UserAccessContextProps) => {
    const { children } = props;
    const [UserAccess, dispatch] = useThunkReducer(UserAccessReducer, initialState);

    return (
        <UserAccessContext.Provider value={UserAccess}>
            <UserAccessContextDispatch.Provider value={dispatch}>
                {children}
            </UserAccessContextDispatch.Provider>
        </UserAccessContext.Provider>
    )
}

// // eslint-disable-next-line react-refresh/only-export-components
// export function useUserAccess(): UserAccessContextDataType {
//     const context = useContext(UserAccessContext);
//     return context as UserAccessContextDataType;
//   }
  
// // eslint-disable-next-line react-refresh/only-export-components
// export function useUserAccessDispatch(): DispatcherThunk<Reducer<UserAccessContextDataType, UserAccessReduxAction>>  {
// const context = useContext(UserAccessContextDispatch);
// return context as DispatcherThunk<Reducer<UserAccessContextDataType, UserAccessReduxAction>>;
// }