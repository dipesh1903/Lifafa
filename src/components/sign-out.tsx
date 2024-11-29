import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { Tooltip, IconButton } from "@radix-ui/themes";
import { getAuth, GoogleAuthProvider, linkWithPopup, User, UserCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthActionFactory } from "../store/auth/actionCreator";
import { useAuth, useAuthDispatch } from "../store/auth/context";
import { toast } from "react-toastify";

export default function SignOut() {

    const navigate = useNavigate();
    const auth = getAuth();
    const authUser = useAuth();
    const dispatch = useAuthDispatch();

    async function onAction() {
        if (authUser.isAnonymousUser) {
            navigate(`/login?join=true&redirectLink=${location.pathname}`, {
                replace: true
            })
            linkWithPopup(auth.currentUser as User, new GoogleAuthProvider())
            .then((user: UserCredential) => {
                dispatch(AuthActionFactory.signIn(user.user, true))
                toast.success("Signed up Successfull")
                toast.info("You are free to use all app features");
            }).catch((error) => {
                toast.error("User is already signed up. Try logging in with the user")
                navigate(`/login?redirectLink=${location.pathname}`, {
                    replace: true,
                    state: {
                        showLogInForm: true
                    }
                })
            });
        } else {
            try {
                await auth.signOut()
                dispatch(AuthActionFactory.signOut())
                navigate('/login', {
                    replace: true
                })
            } catch (err) {}
        }
    }

    return (
        <Tooltip content={authUser.isAnonymousUser ? 'LogIn' : 'LogOut'}>
            <IconButton size="3" variant="soft" className="rotate-180" onClick={onAction}>
                {authUser.isAnonymousUser ?  <EnterIcon width="22" height="22" /> : <ExitIcon width="22" height="22" />}
            </IconButton>
        </Tooltip>
    )
}