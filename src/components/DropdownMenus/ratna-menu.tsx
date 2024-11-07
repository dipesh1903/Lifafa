import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/Dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

type props = {
    children: ReactNode
}

export default function RatnaMenuComponent({children}: props) {
    return (
        <Dropdown>
            <DropdownTrigger>
                    <DotsVerticalIcon className="text-light-onSurfaceVariant"/>
            </DropdownTrigger>
            <DropdownContent className="mt-2">
                {
                    children
                }
            </DropdownContent>
        </Dropdown>
    )
}