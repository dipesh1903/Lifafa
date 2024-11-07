import { TrashIcon } from "@radix-ui/react-icons";
import { SyntheticEvent } from "react";
import { deleteLifafa } from "../../../api/api";
import { useAuth } from "../../../store/auth/context";
import { LifafaFE } from "../../../types/documentFETypes";
import { useLifafaDispatch } from "../../../store/lifafas/context";
import { LifafaActionFactory } from "../../../store/lifafas/actionCreator";
import { DropdownMenuItem } from "../../ui/Dropdown-menu";

type props = {
    lifafa: LifafaFE
}

export default function DeleteLifafa({lifafa}: props) {
    const user = useAuth();
    const dispatch = useLifafaDispatch();
    function deleteLifafas(e: SyntheticEvent) {
        e.stopPropagation();
        console.log('called');
        deleteLifafa(lifafa.id, user.user.uid)
        .then(_ => {
            dispatch(LifafaActionFactory.deleteLifafaCompleted(lifafa.id))
        })
        .catch(_ => console.log('delete failed'))
    }
    return (
        <DropdownMenuItem onClick={(e: SyntheticEvent<HTMLElement>) => {e.stopPropagation(); deleteLifafas(e)}}>
            <TrashIcon className="pr-2 size-6" onClick={() => console.log('nothing called')}/> delete
        </DropdownMenuItem>
    )
}