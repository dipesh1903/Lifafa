import { createContext, ReactElement, ReactNode, useContext, useState } from "react";

export type configContextType =  DOMRect

const configContext = createContext<configContextType>({} as configContextType)
const configContextDispatch = createContext((val: DOMRect) => {});

export function ConfigContextProvider({children}: {children: ReactNode}) {
    const [state , setState] = useState<configContextType>({} as configContextType);

    function setPos(val: DOMRect) {
        console.log('the dimension is ', val);
        setState(val);
    }
    return (
        <configContext.Provider value={state}>
            <configContextDispatch.Provider value={setPos}>
                {children}
            </configContextDispatch.Provider>
        </configContext.Provider>
    )
}

export function useConfig(): configContextType {
    return useContext(configContext);
}

export function useConfigDispatch(): React.Dispatch<React.SetStateAction<configContextType>> {
    return useContext(configContextDispatch) as React.Dispatch<React.SetStateAction<configContextType>>;
}
