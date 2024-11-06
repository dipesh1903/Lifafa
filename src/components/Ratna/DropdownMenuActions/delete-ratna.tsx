import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { SyntheticEvent } from "react";
import { RatnaFE } from "../../../types/documentFETypes";
import { deleteRatna } from "../../../api/ratna";
import { useRatnaDispatch } from "../../../store/ratnas/context";
import { RatnaActionFactory } from "../../../store/ratnas/actionCreator";

type props = {
    ratna: RatnaFE,
    lifafaId: string
}

export default function DeleteRatna({ratna, lifafaId}: props) {
    const dispatch = useRatnaDispatch();
    function deleteRatnas(e: SyntheticEvent) {
        e.stopPropagation();
        deleteRatna(lifafaId, ratna.id).then(_ => {
            dispatch(RatnaActionFactory.deleteRatnaCompleted(lifafaId, ratna.id))
        }).catch(err => console.log(err))
    }
    return (
        <DropdownMenuItem onClick={(e: SyntheticEvent) => {deleteRatnas(e)}}>
            <Pencil1Icon /> delete
        </DropdownMenuItem>
    )
}