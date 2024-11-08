import { ExitIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Flex, Tooltip, IconButton } from "@radix-ui/themes";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../../store/auth/context";
import { AuthActionFactory } from "../../store/auth/actionCreator";

export default function SideBar() {
    const navigate = useNavigate();
    const auth = getAuth();
    const dispatch = useAuthDispatch();
    async function signOut() {
        try {
            await auth.signOut()
            dispatch(AuthActionFactory.signOut())
            navigate('/login', {
                replace: true
            })
        } catch (err) {
            console.log(err);
        }
    }

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
                <Tooltip content="Logout">
                    <IconButton size="3" variant="soft" className="rotate-180" onClick={signOut}>
                        <ExitIcon width="22" height="22" />
                    </IconButton>
                </Tooltip>
            </Flex>
        </Flex>
    )
}