import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { SyntheticEvent } from "react";
import { leaveProtectedLifafa, leavePublicLifafa } from "../../../api/api";
import { useAuth } from "../../../store/auth/context";
import { LifafaFE } from "../../../types/documentFETypes";
import { LifafaAccessType } from "../../../constant";
import { useLifafaDispatch } from "../../../store/lifafas/context";
import { LifafaActionFactory } from "../../../store/lifafas/actionCreator";

type props = {
    lifafa: LifafaFE
}

export default function LeaveLifafa({lifafa}: props) {
    const user = useAuth();
    const dispatch = useLifafaDispatch();
    function leaveLifafa(e: SyntheticEvent) {
        e.stopPropagation();
        if (
            lifafa.accessType === LifafaAccessType.PUBLIC
        ) {
            leavePublicLifafa(lifafa.id, user.user.uid)
            .then(_ => {
                dispatch(LifafaActionFactory.deleteLifafaCompleted(lifafa.id))
            })
            .catch(_ => console.log('remove failed'))
        } else if (
            lifafa.accessType === LifafaAccessType.PROTECTED
        ) {
            leaveProtectedLifafa(user.user.uid, lifafa.id)
            .then(_ => {
                dispatch(LifafaActionFactory.deleteLifafaCompleted(lifafa.id))
            })
            .catch(_ => console.log('remove protected failed'))
        }
    }
    return (
        <DropdownMenuItem onClick={(e: SyntheticEvent<HTMLElement>) => {e.stopPropagation(); leaveLifafa(e)}}>
            <Pencil1Icon className="pr-2" onClick={() => console.log('nothing called')}/> Leave
        </DropdownMenuItem>
    )
}