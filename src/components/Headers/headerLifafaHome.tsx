import { UpdateIcon, DropdownMenuIcon } from "@radix-ui/react-icons";
import { Flex, IconButton } from "@radix-ui/themes";
import HeaderInfo from "./headerInfo";

export default function HeaderLifafaHome() {
    return (
        <Flex justify="between" align="center" className="w-full border-b-[2px] border-b-slate-100 p-2">
            <HeaderInfo title="Lifafa"/>
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