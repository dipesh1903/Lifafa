import { ReactElement } from "react";
import { LifafaProvider } from "./lifafas/context";
import { RatnaProvider } from "./ratnas/context";
import { UserAccessProvider } from "./UsersAccess/context";

type props = {
    children: ReactElement
}

export default function StoreProvider({children}: props) {
    return (
        <LifafaProvider>
            <RatnaProvider>
                <UserAccessProvider>
                    {children}
                </UserAccessProvider>
            </RatnaProvider>
        </LifafaProvider>
    )
}