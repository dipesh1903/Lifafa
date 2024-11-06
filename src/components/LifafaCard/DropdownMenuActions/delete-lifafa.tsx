import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { SyntheticEvent } from "react";
import { deleteLifafa } from "../../../api/api";
import { useAuth } from "../../../store/auth/context";
import { LifafaFE } from "../../../types/documentFETypes";
import { useLifafaDispatch } from "../../../store/lifafas/context";
import { LifafaActionFactory } from "../../../store/lifafas/actionCreator";

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
            <Pencil1Icon className="pr-2" onClick={() => console.log('nothing called')}/> delete
        </DropdownMenuItem>
    )
}