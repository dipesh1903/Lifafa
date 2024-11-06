import { Flex } from "@radix-ui/themes";
import { RatnaFE, SharedUserFE } from "../../../types/documentFETypes";
import CardInfo from "./cardInfo";
import RatnaMenuComponent from "../../DropdownMenus/ratna-menu";
import { ReactNode, SyntheticEvent } from "react";
import { isRatnaCreator } from "../../../utils";
import { useAuth } from "../../../store/auth/context";
import { DropdownMenuItem } from "../../ui/Dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";
import DeleteRatna from "../DropdownMenuActions/delete-ratna";
import EditRatnas from "../DropdownMenuActions/edit-ratna";

type props = {
    ratna: RatnaFE,
    access: SharedUserFE,
    lifafaId: string
}

export default function RatnaCard({ratna, access, lifafaId}: props) {
    const user = useAuth();
    const menuItems: ReactNode[] = [
        <DropdownMenuItem>
            <Pencil1Icon /> Info
        </DropdownMenuItem>,
        <DropdownMenuItem onClick={(e: SyntheticEvent) => {
            e.stopPropagation();
            navigator.clipboard.writeText(ratna.content);
        }}>
            <Pencil1Icon /> Copy
        </DropdownMenuItem>
    ];
    if (!!isRatnaCreator(ratna, user.user.uid)) {
        menuItems.push(...[
            <EditRatnas ratna={ratna} />,
            <DeleteRatna ratna={ratna} lifafaId={lifafaId}/>
        ])
    }
    console.log('menu items created', menuItems);
    return (
        <Flex justify="between" className="p-6 border-b-[1px]">
            <CardInfo ratna={ratna}/>
            <RatnaMenuComponent>
                {
                    ...menuItems
                }
            </RatnaMenuComponent>
        </Flex>
    )
}