import { DoubleArrowUpIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Flex, Tooltip, IconButton } from "@radix-ui/themes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LifafaListDrawer from "../Drawers/Lifafa";
import { useState } from "react";
import { useConfig } from "../../store/config/context";
import PulseAnimation from "../ui/pulse-animation";
import { useLifafa } from "../../store/lifafas/context";

export default function SideBarMobile() {
    const navigate = useNavigate();
    const [open , setOpen] = useState(false);
    const config = useConfig();
    const { lifafaId } = useParams();
    const location = useLocation();
    const lifafas = useLifafa();

    function onClick() {
        if (lifafaId) {
            navigate(`${location.pathname}/ratna/create`, {
                state: {ratna: {}},
                relative: 'path'
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
                        <div className="relative h-fit" onClick={onClick}>
                            <IconButton size="3" variant="soft" className="cursor-pointer">
                                <PlusCircledIcon width="22" height="22"/>
                            </IconButton>
                            {
                                (!lifafas || !Object.keys(lifafas.data).length) && <PulseAnimation/>
                            }
                        </div>
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