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
                <DropdownTrigger className="active:outline-none">
                        <DotsVerticalIcon className="text-light-onSurfaceVariant"/>
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