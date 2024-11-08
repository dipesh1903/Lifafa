import { DoubleArrowUpIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Flex, Tooltip, IconButton } from "@radix-ui/themes";
import { useNavigate, useParams } from "react-router-dom";
import LifafaListDrawer from "../Drawers/Lifafa";
import { useState } from "react";
import { useConfig } from "../../store/config/context";

export default function SideBarMobile() {
    const navigate = useNavigate();
    const [open , setOpen] = useState(false);
    const config = useConfig();
    const { lifafaId } = useParams();

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
        <>
            <Flex direction="row" style={{width: config.width}} className={`h-screen p-2 bg-opacity-80 fixed top-[calc(100%-60px)] justify-evenly bg-light-surfaceVariant`}>
                <Flex>
                    <Tooltip content={lifafaId ? 'Add Ratna' : 'Add Lifafa'}>
                        <IconButton size="3" variant="soft" className="cursor-pointer" onClick={onClick}>
                            <PlusCircledIcon width="22" height="22"/>
                        </IconButton>
                    </Tooltip>
                </Flex>
                <IconButton size="3" className="cursor-pointer" variant="soft" onClick={() => setOpen(true)}>
                        <DoubleArrowUpIcon width="22" height="22"/>
                </IconButton>
            </Flex>
            {
                open ? <LifafaListDrawer open={open} setOpen={setOpen} /> : null
            }
        </>
    )
}