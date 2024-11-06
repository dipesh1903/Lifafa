import { IconButton } from "@radix-ui/themes";
import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/Dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { LifafaFE } from "../../types/documentFETypes";
import { ReactNode } from "react";

type props = {
    lifafa: LifafaFE,
    menuItems: ReactNode[]
}

export default function LifafaMenuComponent({menuItems}: props) {
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
                        ...menuItems
                    }
                </DropdownContent>
            </Dropdown>
        </>
    )
}