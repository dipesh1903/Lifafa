import { Box, Flex } from "@radix-ui/themes";
import { Drawer, DrawerContent, DrawerOverlay } from "../ui/Drawer";
import { useAuth } from "../../store/auth/context";
import { cn } from "../../utils";
import { useLifafa, useLifafaDispatch } from "../../store/lifafas/context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllLifafa } from "../../api/api";
import { LifafaActionFactory } from "../../store/lifafas/actionCreator";
import { useConfig } from "../../store/config/context";
import LifafaCard from "../LifafaCard";
import { PrimaryButton } from "../ui/Button";

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
                        <Flex direction="column" className="overflow-scroll">
                        <PrimaryButton onClick={() => { onOpenChange(false); navigate('/lifafa/create')}} className="my-4">Create</PrimaryButton>
                        <Box className="border-y-[0.5px] overflow-scroll mt-2 w-full bg-light-surface border-light-outlineVariant">
                        {
                            result.map(item => {
                                return (
                                    <Box className="px-6 py-4 border-b-[0.5px] border-light-outlineVariant hover:bg-light-surfaceDim hover:cursor-pointer"
                                    key={item.lifafa.id}
                                    onClick={() => {onOpenChange(false); navigate(`/lifafa/${item.lifafa.id}`)}}>
                                        <LifafaCard 
                                        lifafa={item.lifafa}/>
                                    </Box>
                                )
                            })
                        }
                    </Box>
                        </Flex>
                    </DrawerContent>
                </DrawerOverlay>
        </Drawer>
    )
}