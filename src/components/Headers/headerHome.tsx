import { UpdateIcon, DropdownMenuIcon } from "@radix-ui/react-icons";
import { Flex, Button, ChevronDownIcon, IconButton } from "@radix-ui/themes";
import HeaderInfo from "./headerInfo";
import { useState } from "react";
import LifafaListDrawer from "../Drawers/Lifafa";

export default function HeaderHome() {
    const [open,setOpen] = useState<boolean>(false);
    return (
        <Flex justify="between" align="center" className="w-full border-b-[1px] border-b-slate-100 p-4">
            <HeaderInfo title="Lifafa"/>
            <Flex gap="2" align="center">
                <Button variant="soft" radius="full" onClick={() => setOpen(true)}>
                    <ChevronDownIcon /> Switch Lifafa
                </Button>
                <IconButton variant="ghost">
                    <UpdateIcon width="22"/>
                </IconButton>
                <IconButton variant="ghost">
                    <DropdownMenuIcon width="22"/>
                </IconButton>
            </Flex>
            {
                open ? <LifafaListDrawer open={open} setOpen={setOpen} /> : null
            }
        </Flex>
    )
}