import { createContext, ReactNode } from "react";
import { initialState, UserAccessReducer } from "./reducer";
import { SharedUserFE } from "../../types/documentFETypes";
import { useThunkReducer } from "../../utils/hooks/useReducerThunk";

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