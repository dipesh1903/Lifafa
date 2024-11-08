import { Flex } from "@radix-ui/themes";
import { RatnaFE, SharedUserFE } from "../../../types/documentFETypes";
import CardInfo from "./cardInfo";
import RatnaMenuComponent from "../../DropdownMenus/ratna-menu";
import { ReactNode, SyntheticEvent } from "react";
import { isRatnaCreator, isValidUrl } from "../../../utils";
import { useAuth } from "../../../store/auth/context";
import { DropdownMenuItem } from "../../ui/Dropdown-menu";
import { CopyIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import DeleteRatna from "../DropdownMenuActions/delete-ratna";
import EditRatnas from "../DropdownMenuActions/edit-ratna";

type props = {
    ratna: RatnaFE,
    access: SharedUserFE,
    lifafaId: string
}

export default function RatnaCard({ratna, lifafaId}: props) {
    const user = useAuth();
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
            <EditRatnas ratna={ratna} />,
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
        <Flex direction="column" className="p-6 border-b-[1px] hover:bg-light-primaryContainer hover:bg-opacity-50 hover:cursor-pointer">
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
            <Flex justify="end" className="pt-4">
                {ratna.description && <p className="bg-light-tertiary text-light-inverseOnSurface max-h-60 pt-2 flex w-[50%] border-light-outline rounded-lg mr-4 p-4 ">{ratna.description}</p> }
                <div className={` text-light-onSurface rounded-lg w-[50%]  bg-light-tertiaryContainer p-4` }>
                    <div className="italic">From</div>
                    <div className="italic font-semibold">{ratna.creatorName}</div>
                    <p className="p-0 pt-1 font-semibold">{ratna.createdAt.toDate().toLocaleDateString()}</p>
                </div>
            </Flex>
        </Flex>
    )
}