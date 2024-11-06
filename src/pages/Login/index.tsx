import LogoComponent from "../../assets/svg/AppIcon.svg";
import "./constants";
import { LOGIN } from "./constants";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { firebaseAuth, googleProvider } from "../../config/firebase.config";
import { useAuth, useAuthDispatch } from "../../store/auth/context";
import { AuthActionFactory } from "../../store/auth/actionCreator";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Heading } from "@radix-ui/themes";
import GoogleIcon from "../../assets/svg/GmailIcon.svg";

export default function Login() {
    const dispatch = useAuthDispatch();
    const navigate = useNavigate();
    const authUser = useAuth();

    function signInWithGoogle() {
        signInWithPopup(firebaseAuth, googleProvider).then((res: UserCredential) => {
            dispatch(AuthActionFactory.signIn(res.user, true))
            navigate('/lifafa');
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
                <Flex direction='column' align="center" justify="center" className="p-10 border-[1px] w-fit m-auto rounded-lg h-[400px] border-stone-300">
                    <img src={LogoComponent} width="80px" height="80px" className="pb-4"/>
                    <Heading size="6">{LOGIN.title}</Heading>
                    <p className="text-gray-400 font-">{LOGIN.message}</p>
                    <Button variant="outline" onClick={signInWithGoogle} className="my-3 cursor-pointer">
                        <img src={GoogleIcon} width="20px"/> {LOGIN.gmailBtnText}
                    </Button>
                </Flex>
            </Flex>
        )
    }
}