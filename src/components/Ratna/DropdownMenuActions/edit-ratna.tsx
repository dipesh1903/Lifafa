import { Pencil1Icon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "../../ui/Dropdown-menu";
import { RatnaFE } from "../../../types/documentFETypes";
import { SyntheticEvent } from "react";

type props = {
    ratna: RatnaFE,
    setOpen: (val: boolean) => void
}

export default function EditRatnas({setOpen}: props) {
    return (
        <>
            <DropdownMenuItem onClick={(e: SyntheticEvent) => {e.stopPropagation(); 
                setOpen(true)
            }}>
                <Pencil1Icon className="pr-2 size-6"/> edit
            </DropdownMenuItem>
        </>
    )
}