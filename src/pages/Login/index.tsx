import LogoComponent from "../../assets/svg/AppIcon.svg";
import "./constants";
import { LOGIN } from "./constants";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { firebaseAuth, googleProvider } from "../../config/firebase.config";
import { useAuth, useAuthDispatch } from "../../store/auth/context";
import { AuthActionFactory } from "../../store/auth/actionCreator";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Flex } from "@radix-ui/themes";
import GoogleIcon from "../../assets/svg/GmailIcon.svg";

export default function Login() {
    const dispatch = useAuthDispatch();
    const navigate = useNavigate();
    const authUser = useAuth();
    const [searchUrl] = useSearchParams()

    function signInWithGoogle() {
        signInWithPopup(firebaseAuth, googleProvider).then((res: UserCredential) => {
            dispatch(AuthActionFactory.signIn(res.user, true))
            const redirectLink = searchUrl.get('redirectLink')
            if (redirectLink) {
                navigate(redirectLink, {
                    replace: true
                })
            } else {
                navigate('/lifafa');
            }
        }).catch(() => {
            dispatch(AuthActionFactory.signOut())
        })
      }
    
    if((authUser && authUser.user.uid)) {
        navigate(`/lifafa`, {
            replace: true,
        })
    } else {
        return (
            <Flex className="h-lvh w-lvw m-auto">
                <Flex direction='column' align="center" justify="center" className="p-10 mx-4 text-center border-[1px] w-fit m-auto rounded-lg h-[400px] border-stone-300">
                    <img src={LogoComponent} width="80px" height="80px" className="pb-4"/>
                    <p className="font-bold">{LOGIN.message}</p>
                    <Button variant="outline" onClick={signInWithGoogle} className="my-4 h-10 cursor-pointer">
                        <img src={GoogleIcon} width="30px"/> {LOGIN.gmailBtnText}
                    </Button>
                </Flex>
            </Flex>
        )
    }
}