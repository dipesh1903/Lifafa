import { UpdateIcon, DropdownMenuIcon } from "@radix-ui/react-icons";
import { Flex, IconButton } from "@radix-ui/themes";
import HeaderInfo from "./headerInfo";
import { LifafaFE } from "../../types/documentFETypes";

type props = {
    lifafa: LifafaFE
}
export default function HeaderLifafaHome({lifafa}: props) {
    return (
        <Flex justify="between" align="center" className="w-full border-b-[2px] border-b-slate-100 p-2">
            <HeaderInfo title={lifafa.name}/>
            <Flex gap="2" align="center">
                <IconButton variant="ghost">
                    <UpdateIcon width="22"/>
                </IconButton>
                <IconButton variant="ghost">
                    <DropdownMenuIcon width="22"/>
                </IconButton>
            </Flex>
        </Flex>
    )
}