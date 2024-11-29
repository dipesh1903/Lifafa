import LogoComponent from "../../assets/svg/AppIcon.svg";
import "./constants";
import { LOGIN } from "./constants";
import { getAuth, signInAnonymously, signInWithPopup, UserCredential } from "firebase/auth";
import { firebaseAuth, googleProvider } from "../../config/firebase.config";
import { useAuth, useAuthDispatch } from "../../store/auth/context";
import { AuthActionFactory } from "../../store/auth/actionCreator";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Flex } from "@radix-ui/themes";
import GoogleIcon from "../../assets/svg/GmailIcon.svg";
import { useEffect } from "react";

export default function Login() {
    const dispatch = useAuthDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const authUser = useAuth();
    const [searchUrl] = useSearchParams()
    const auth = getAuth();

    useEffect(() => {
        if ((authUser && authUser.user.uid && !state?.showLogInForm)) {
             navigate(`/lifafa`, {
                 replace: true,
           })
         } 
    }, [state])

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

    function signInIncognito() {
        signInAnonymously(auth)
        .then((res) => {
            dispatch(AuthActionFactory.signIn(res.user, true))
            const redirectLink = searchUrl.get('redirectLink')
            if (redirectLink) {
                navigate(redirectLink, {
                    replace: true
                })
            } else {
                navigate('/lifafa');
            }
        })
        .catch(() => {
            dispatch(AuthActionFactory.signOut())
        });
    }
    
    if((!authUser || !authUser.user.uid || !!state?.showLogInForm)) {
        return (
            <Flex className="h-lvh w-lvw m-auto justify-center">
                <Flex direction='column' align="center" justify="center" className="p-10 text-center border-[1px] max-w-[400px] m-auto mx-4 rounded-lg h-[400px] border-stone-300">
                    <img src={LogoComponent} width="80px" height="80px" className="pb-4"/>
                    <p className="font-bold">{LOGIN.message}</p>
                    <Button variant="outline" onClick={signInWithGoogle} className="my-2 mt-4 h-10 cursor-pointer">
                        <img src={GoogleIcon} width="30px"/> {LOGIN.gmailBtnText}
                    </Button>
                    <span>or</span>
                    <Button variant="outline" onClick={signInIncognito} className="my-2 h-10 cursor-pointer">
                         Try Anonymously
                    </Button>
                </Flex>
            </Flex>
        )
    }
}