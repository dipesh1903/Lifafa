import { ExitIcon } from "@radix-ui/react-icons";
import { Tooltip, IconButton } from "@radix-ui/themes";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthActionFactory } from "../store/auth/actionCreator";
import { useAuthDispatch } from "../store/auth/context";

export default function SignOut() {
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
        }
    }

    return (
        <Tooltip content="Logout">
            <IconButton size="3" variant="soft" className="rotate-180" onClick={signOut}>
                <ExitIcon width="22" height="22" />
            </IconButton>
        </Tooltip>
    )
}