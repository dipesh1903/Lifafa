
import { TrashIcon } from "@radix-ui/react-icons";
import { SyntheticEvent } from "react";
import { RatnaFE } from "../../../types/documentFETypes";
import { deleteRatna } from "../../../api/ratna";
import { useRatnaDispatch } from "../../../store/ratnas/context";
import { RatnaActionFactory } from "../../../store/ratnas/actionCreator";
import { DropdownMenuItem } from "../../ui/Dropdown-menu";

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
        }).catch()
    }
    return (
        <DropdownMenuItem onClick={(e: SyntheticEvent) => {deleteRatnas(e)}}>
            <TrashIcon className="pr-2 size-6"/> delete
        </DropdownMenuItem>
    )
}