import { IconButton } from "@radix-ui/themes";
import { Dropdown, DropdownContent, DropdownMenuItem, DropdownTrigger } from "../ui/Dropdown-menu";
import { DotsVerticalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { RatnaFE, SharedUserFE } from "../../types/documentFETypes";
import { ReactNode, SyntheticEvent, useState } from "react";
import { deleteRatna } from "../../api/ratna";
import EditRatnas from "../Ratna/DropdownMenuActions/edit-ratna";
import DeleteRatna from "../Ratna/DropdownMenuActions/delete-ratna";

type props = {
    menuItems?: ReactNode[],
    children: ReactNode
}

export default function RatnaMenuComponent({menuItems, children}: props) {
    console.log('menu items', menuItems)
    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <IconButton variant="outline">
                        <DotsVerticalIcon width="16" height="16" />
                    </IconButton>
                </DropdownTrigger>
                <DropdownContent>
                    {
                        children
                    }
                </DropdownContent>
            </Dropdown>
        </>
    )
}