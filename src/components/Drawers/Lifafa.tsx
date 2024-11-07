import { Flex } from "@radix-ui/themes";
import { Drawer, DrawerContent, DrawerOverlay } from "../ui/Drawer";
import { useAuth } from "../../store/auth/context";
import { cn } from "../../utils";
import { useLifafa, useLifafaDispatch } from "../../store/lifafas/context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllLifafa } from "../../api/api";
import { LifafaActionFactory } from "../../store/lifafas/actionCreator";
import { useConfig } from "../../store/config/context";

type props = {
    drawerPosition?: {width: number , left: number},
    setOpen?: (val: boolean) => void,
    open?: boolean
}

// this component can be opened via route and without route
export default function LifafaListDrawer({setOpen , open}: props) {
    const user = useAuth();
    const lifafas = useLifafa();
    const navigate = useNavigate();
    const dispatch = useLifafaDispatch();
    const config = useConfig();
    const result = Object.values(lifafas.data || {})

    useEffect(() => {
        if (!lifafas.isAllLoaded) {
            getAllLifafa(user.user.uid).then(val => {
                dispatch(LifafaActionFactory.fetchAllLifafaCompleted(val));
            })
        }
    }, [])

    function onOpenChange(val: boolean) {
        if (typeof setOpen === 'function') {
            setOpen(val)
        } else {
            navigate(-1)
        }
    }

    function isOpen() {
        return ((open !== undefined && open !== null) ?  open : true)
    }


    return (
        (config) &&
        <Drawer open={isOpen()} onOpenChange={onOpenChange}>
                <DrawerOverlay>
                    <DrawerContent style={{left: `${(config).left}px`, width: `${(config).width}px` }} className={cn("p-4 fixed bottom-0 flex m-auto left-[20px] h-[80%]")}>
                        <Flex direction="column">
                            {
                                result.length ?
                                result.map(item => {
                                    return <div key={item.lifafa.id} data-id={item.lifafa.id}>{item.lifafa.name}</div>
                                }) : <div>No lifafas for you</div>
                            }
                        </Flex>
                    </DrawerContent>
                </DrawerOverlay>
        </Drawer>
    )
}