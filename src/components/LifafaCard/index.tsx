import { Flex } from "@radix-ui/themes";
import { LifafaFE } from "../../types/documentFETypes";
import CardInfo from "./CardInfo";
import LifafaMenuComponent from "../DropdownMenus/lifafa-menu";
import LifafaCardActions from "./actions";
import DeleteLifafa from "./DropdownMenuActions/delete-lifafa";
import { useAuth } from "../../store/auth/context";
import { isLifafaOwner, isUserHasProtectedAccess, isUserHasPublicAccess } from "../../utils";
import { ReactNode } from "react";
import LeaveLifafa from "./DropdownMenuActions/leave-lifafa";

type props = {
    lifafa: LifafaFE
}

export default function LifafaCard({lifafa}: props) {
    const user = useAuth();
    let val: ReactNode[] = [];
    if(isLifafaOwner(lifafa, user.user.uid)) {
        val = [
            <DeleteLifafa lifafa = {lifafa}/>
        ]
    } else if (isUserHasProtectedAccess(lifafa, user.user.uid)) {
        val = [
            <LeaveLifafa lifafa = {lifafa}/>
        ]
    } else if (isUserHasPublicAccess(lifafa, user.user.uid)) {
        val = [
            <LeaveLifafa lifafa = {lifafa}/>
        ]
    }
    return (
            (val && val.length) &&  <Flex direction="column" className="w-full">
                <Flex justify="between">
                    <CardInfo lifafa={lifafa}/>
                    <LifafaMenuComponent lifafa={lifafa} menuItems={val}/>
                </Flex>
                <LifafaCardActions lifafa={lifafa} />
            </Flex>
    )
}