import { ReactElement } from "react";
import { LifafaProvider } from "./lifafas/context";
import { RatnaProvider } from "./ratnas/context";

type props = {
    children: ReactElement
}

export default function StoreProvider({children}: props) {
    return (
        <LifafaProvider>
            <RatnaProvider>
                    {children}
            </RatnaProvider>
        </LifafaProvider>
    )
}