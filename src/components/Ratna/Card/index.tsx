import { Flex } from "@radix-ui/themes";
import { RatnaFE, SharedUserFE } from "../../../types/documentFETypes";
import CardInfo from "./cardInfo";
import RatnaMenuComponent from "../../DropdownMenus/ratna-menu";
import { ReactNode, SyntheticEvent, useState } from "react";
import { getDisplayName, isRatnaCreator, isValidUrl } from "../../../utils";
import { useAuth } from "../../../store/auth/context";
import { DropdownMenuItem } from "../../ui/Dropdown-menu";
import { CopyIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import DeleteRatna from "../DropdownMenuActions/delete-ratna";
import EditRatnas from "../DropdownMenuActions/edit-ratna";
import { Month } from "../../../constant";
import EditRatna from "../../edit-ratna";

type props = {
    ratna: RatnaFE,
    access: SharedUserFE,
    lifafaId: string
}

export default function RatnaCard({ratna, lifafaId}: props) {
    const user = useAuth();
    const [open , setOpen] = useState(false);
    const menuItems: ReactNode[] = [
        <DropdownMenuItem>
            <InfoCircledIcon className="pr-2 size-6"/> Info
        </DropdownMenuItem>,
        <DropdownMenuItem onClick={(e: SyntheticEvent) => {
            e.stopPropagation();
            navigator.clipboard.writeText(ratna.content);
        }}>
            <CopyIcon className="pr-2 size-6"/> Copy
        </DropdownMenuItem>
    ];
    if (!!isRatnaCreator(ratna, user.user.uid)) {
        menuItems.push(...[
            <EditRatnas ratna={ratna} setOpen={setOpen} />,
            <DeleteRatna ratna={ratna} lifafaId={lifafaId}/>
        ])
    }

    function openContent(e: SyntheticEvent) {
        e.stopPropagation();
        if (!!isValidUrl(ratna.content)) {
            window.open(ratna.content, '_blank');
        }
    }
    return (
        <Flex direction="row" className="hover:bg-light-primaryContainer hover:bg-opacity-50 hover:cursor-pointer">
            <div className="flex-col justify-items-center pt-[10px]  text-sm font-semibold  text-light-outline px-6">
                <p>{Month[ratna.createdAt.toDate().getMonth() - 1]}</p>
                <p className="text-[12px]">{ratna.createdAt.toDate().getDate()}, {ratna.createdAt.toDate().getFullYear()}</p>
            </div>
            <div className="relative w-[1px] border-l border-b border-light-outlineVariant">
                <div className="font-semibold absolute top-[10px] text-light-onPrimary bg-light-primary left-[-15px] text-xs border-2 rounded-full border-light-outlineVariant p-[4px]">{getDisplayName(ratna.creatorName)}</div>
            </div>
            <Flex direction="column" flexGrow="1" className="p-6 pt-[12px] border-b-[1px] ">
                <Flex justify="between"
                    className=""
                    onClick={(e: SyntheticEvent) => openContent(e)}>
                    <CardInfo ratna={ratna}/>
                    <RatnaMenuComponent>
                        {
                            ...menuItems
                        }
                    </RatnaMenuComponent>
                </Flex>
            </Flex>
            {
                open ? <EditRatna ratna={ratna} open={open} setOpen={setOpen} /> : null
            }
        </Flex>
    )
}