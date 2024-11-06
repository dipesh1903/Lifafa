import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Flex, Tooltip, IconButton } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import CreateLifafaDialog from "../Dialogs/CreateLifafa";
import { useLocation, useNavigate } from "react-router-dom";
import { createLifafa } from "../../api/api";
import { LifafaAccessType } from "../../constant";
import { useAuth } from "../../store/auth/context";
import { Timestamp } from "firebase/firestore";

export default function SideBar() {
    const [open, setOpen] = useState(false);
    const user = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     if(location.pathname.includes('/lifafa/create')) {
    //         setOpen(true);
    //     }
    // },[location.pathname])

    async function onCreate(name: string, accessType: LifafaAccessType, password?: string) {
        try {
            const lifafa = await createLifafa({
                name,
                sharedUserId: [],
                tags: [],
                accessType,
                description: "",
                createdBy: user.user.uid,
                createdAt: Timestamp.fromDate(new Date())
            }, user.user.uid, password)
            setOpen(false)
            navigate(`/lifafa/${Object.keys(lifafa)[0]}`, {
                replace: true
            })
        } catch (err) {
            navigate('..');
        }
    }

    return (
        <>
            <Flex direction="column" justify="between" className="h-screen p-2">
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
            {/* {
                open ? <CreateLifafaDialog open={open} setOpen={setOpen} onCreate={onCreate}/> : null
            } */}
        </>
    )
}