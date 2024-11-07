import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Flex, Tooltip, IconButton } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
    const navigate = useNavigate();

    return (
        <Flex direction="column" justify="between" className={`h-screen p-2 fixed top-0 bottom-0`}>
            <Flex>
                <Tooltip content="Add Lifafa">
                    <IconButton size="3" variant="soft" className="cursor-pointer" onClick={() => navigate('/lifafa/create')}>
                        <PlusCircledIcon width="22" height="22"/>
                    </IconButton>
                </Tooltip>
            </Flex>
            <Flex>
                <IconButton size="3" variant="soft">
                    <PlusCircledIcon width="22" height="22" />
                </IconButton>
            </Flex>
        </Flex>
    )
}