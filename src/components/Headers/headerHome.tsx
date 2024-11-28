import { Flex, Button, ChevronDownIcon } from "@radix-ui/themes";
import HeaderInfo from "./headerInfo";
import { useState } from "react";
import LifafaListDrawer from "../Drawers/Lifafa";
import { LifafaFE } from "../../types/documentFETypes";
import SignOut from "../sign-out";

export default function HeaderHome({lifafa}: {lifafa: LifafaFE}) {
    const [open,setOpen] = useState<boolean>(false);



    return (
        <Flex justify="between" align="center" className="w-full border-b-[1px] bg-light-primaryContainer p-4">
            <HeaderInfo title={lifafa.name}/>
            <Flex gap="2" align="center" className="max-sm:hidden">
                <Button  variant="soft" radius="full" className="bg-light-primary text-light-onPrimary" onClick={() => setOpen(true)}>
                    <ChevronDownIcon /> Switch Lifafa
                </Button>
                {/* <IconButton variant="ghost">
                    <UpdateIcon width="22"/>
                </IconButton>
                <IconButton variant="ghost">
                    <DropdownMenuIcon width="22"/>
                </IconButton> */}
            </Flex>
            <Flex gap="2" align="center" className="hidden max-sm:block">
                <SignOut />
            </Flex>
            {
                open ? <LifafaListDrawer open={open} setOpen={setOpen} /> : null
            }
        </Flex>
    )
}