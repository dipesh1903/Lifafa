import { createContext, ReactNode, Reducer, useContext } from "react";
import { initialState, RatnaReducer } from "./reducer";
import { RatnaFE } from "../../types/documentFETypes";
import { RatnaReduxAction } from "./actionCreator";
import { DispatcherThunk, useThunkReducer } from "../../utils/hooks/useReducerThunk";
export type RatnaContextDataType = {
    data: {
        [x: string]: {
                [y: string]: RatnaFE
            }
    },
    isFetching: boolean
}

const RatnaContext = createContext<RatnaContextDataType>({isFetching: true, data: {}});
const RatnaContextDispatch = createContext({});

type RatnaContextProps = {
    children: ReactNode,
}

export const RatnaProvider = (props: RatnaContextProps) => {
    const { children } = props;
    const [Ratna, dispatch] = useThunkReducer(RatnaReducer, initialState);

    return (
        <RatnaContext.Provider value={Ratna}>
            <RatnaContextDispatch.Provider value={dispatch}>
                {children}
            </RatnaContextDispatch.Provider>
        </RatnaContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRatna(): RatnaContextDataType {
    const context = useContext(RatnaContext);
    return context as RatnaContextDataType;
  }
  
// eslint-disable-next-line react-refresh/only-export-components
export function useRatnaDispatch(): DispatcherThunk<Reducer<RatnaContextDataType, RatnaReduxAction>>  {
const context = useContext(RatnaContextDispatch);
return context as DispatcherThunk<Reducer<RatnaContextDataType, RatnaReduxAction>>;
}

export function useGetRatnaFromPath(lifafaId: string): RatnaContextDataType {
    const ratnas = useRatna();

    if (lifafaId) {
        return {
            ...ratnas,
            data: {
                [lifafaId]: {
                    ...ratnas.data[lifafaId]
                }
            }
        }
    } else {
        return {
            ...ratnas,
            data: {}
        }
    }
}

