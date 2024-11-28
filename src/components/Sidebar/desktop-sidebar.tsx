import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Flex, Tooltip, IconButton } from "@radix-ui/themes";
import { useNavigate, useParams } from "react-router-dom";
import SignOut from "../sign-out";
import { useLifafa } from "../../store/lifafas/context";
import PulseAnimation from "../ui/pulse-animation";

export default function SideBar() {
    const navigate = useNavigate();
    const { lifafaId } = useParams();
    const lifafas = useLifafa();
    function onClick() {
        if (lifafaId) {
            navigate(`lifafa/${lifafaId}/ratna/create`, {
                state: {ratna: {}}
            })
        } else {
            navigate('lifafa/create')
        }
    }

    return (
        <Flex direction="column" justify="between" className={`h-screen p-2 fixed top-0 bottom-0`}>
            <Flex>
                <Tooltip content="Add Lifafa">
                    <div className="relative" onClick={onClick}>
                        <IconButton size="3" variant="soft" className="cursor-pointer">
                            <PlusCircledIcon width="22" height="22"/>
                        </IconButton>
                        {
                            (!lifafas || !Object.keys(lifafas.data).length) && <PulseAnimation/>
                        }
                    </div>
                </Tooltip>
            </Flex>
            <Flex>
                <SignOut/>
            </Flex>
        </Flex>
    )
}