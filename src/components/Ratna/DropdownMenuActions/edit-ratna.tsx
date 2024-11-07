import { Pencil1Icon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "../../ui/Dropdown-menu";
import { RatnaFE } from "../../../types/documentFETypes";
import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

type props = {
    ratna: RatnaFE
}

export default function EditRatnas({ratna}: props) {
    const navigate = useNavigate();
    return (
        <>
            <DropdownMenuItem onClick={(e: SyntheticEvent) => {e.stopPropagation(); 
                navigate(`ratna/${ratna.id}/edit`, {
                    state: {
                        ratna
                    }
                })
            }}>
                <Pencil1Icon className="pr-2 size-6"/> edit
            </DropdownMenuItem>
        </>
    )
}