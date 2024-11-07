import { Children, cloneElement, createContext, DetailedReactHTMLElement, HTMLAttributes, ReactNode, Reducer, useContext, useEffect, useMemo, useRef, useState } from "react";
import { initialState, lifafaReducer } from "./reducer";
import { LifafaFE, SharedUserFE } from "../../types/documentFETypes";
import { LifafaReduxAction } from "./actionCreator";
import { DispatcherThunk, useThunkReducer } from "../../utils/hooks/useReducerThunk";
import { UserAccessReduxAction } from "../UsersAccess/actionCreator";
import { useParams } from "react-router-dom";
import equal from "deep-equal";

export type LifafaContextDataType = {
    data: LifafaDataType,
    isFetching: boolean,
    isAllLoaded: boolean
}

export type LifafaDataType = {
    [x: string]: {
        userAccess: {[y: string]: SharedUserFE},
        lifafa: LifafaFE
    }
}

const LifafaContext = createContext<LifafaContextDataType>({isFetching: true, data: {}, isAllLoaded: false});
const LifafaContextDispatch = createContext({});

type LifafaContextProps = {
    children: ReactNode,
}

export const LifafaProvider = (props: LifafaContextProps) => {
    const { children } = props;
    const [lifafa, dispatch] = useThunkReducer(lifafaReducer, initialState);

    return (
        <LifafaContext.Provider value={lifafa}>
            <LifafaContextDispatch.Provider value={dispatch}>
                {children}
            </LifafaContextDispatch.Provider>
        </LifafaContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLifafa(): LifafaContextDataType {
    const context = useContext(LifafaContext);
    return context as LifafaContextDataType;
  }
  
// eslint-disable-next-line react-refresh/only-export-components
export function useLifafaDispatch(): DispatcherThunk<Reducer<LifafaContextDataType, LifafaReduxAction | UserAccessReduxAction>>  {
    const context = useContext(LifafaContextDispatch);
    return context as DispatcherThunk<Reducer<LifafaContextDataType, LifafaReduxAction | UserAccessReduxAction>>;
}

export function useGetLifafaFromPath(): LifafaContextDataType {
    const lifafas = useLifafa();
    const { lifafaId }= useParams();

    if (lifafaId) {
        return {
            ...lifafas,
            data: {
                [lifafaId]: {
                    ...lifafas.data[lifafaId]
                }
            } as LifafaDataType
        }
    } else {
        return {
            ...lifafas,
            data: {}
        }
    }
}

export function MemoComp(props: { children: any }) {
    const [count, setCount] = useState(0);
    const context = useGetLifafaFromPath();

    const ref = useRef<LifafaContextDataType>();

    useEffect(() => {
        if (!ref.current || !equal(ref.current.data, context.data)) {
            ref.current = {...context }
            setCount((prev) => prev + 1);
        }
    }, [context])

    return useMemo(() => {
        const element = Children.map(props.children, (child) =>
            cloneElement(child, {
                lifafaContext: context
            }));
        return (
            <>{element}</>
        )
    }, [count])
}