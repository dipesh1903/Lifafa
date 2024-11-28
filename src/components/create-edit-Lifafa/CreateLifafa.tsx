import { Dialog, DialogContent } from "../ui/Dialog";
import { Flex } from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useConfig } from "../../store/config/context";
import { cn } from "../../utils";
import { useMediaQuery } from "../../utils/hooks/useMediaQuery";
import { DrawerOverlay, DrawerContent, Drawer } from "../ui/Drawer";
import Form from "./lifafa-form";
import { useState } from "react";


export default function CreateLifafaForm() {
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const navigate = useNavigate();
    const [open , setOpen] = useState<boolean>(true);
    const drawerPos = useConfig();
    const location = useLocation();

    function onDialogClose(navigateBack: boolean) {
        setOpen(false);
        setTimeout(() => {
            document.body.style.pointerEvents = "auto";
            if (!!navigateBack)
            navigate('..');
        })
    }

    function onDrawerClose(navigateBack: boolean) {
        setOpen(false);
        if (!!navigateBack)
        navigate('..');
        setTimeout(() => {
            document.body.style.pointerEvents = "auto";
        },1000)
    } 

    if(isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onDialogClose}>
                <DialogContent
                onInteractOutside={() => onDialogClose(true)}
                className="sm:max-w-md p-4 max-sm:w-[calc(100%-30px)] !top-[30%]">
                    <>
                        <Flex justify="between">
                            <h3>{location.state?.lifafaName ? 'Update Lifafa' : 'Create Lifafa'}</h3>
                            <Cross1Icon onClick={() => navigate('..')}/>
                        </Flex>
                        <Form onClose={onDialogClose}/>
                    </>
                </DialogContent>
            </Dialog>
        )
    } else {
        return (
            <Drawer open={open} onOpenChange={onDrawerClose}
            onAnimationEnd={() => {
                setTimeout(() => {
                    document.body.style.pointerEvents = "auto";
                }, 1000)}}>
                <DrawerOverlay>
                    <DrawerContent
                    onInteractOutside={() => onDrawerClose(true)}
                    style={{left: `${(drawerPos).left}px`, width: `${(drawerPos).width}px` , boxShadow: 'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px'}} className={cn("flex flex-col p-4 fixed bottom-0 m-auto left-[20px] h-[80%")}>
                        <Form onClose={onDialogClose}/>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        )
    }
}

