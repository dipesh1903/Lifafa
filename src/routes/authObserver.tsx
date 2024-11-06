import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { ReactNode } from "react";
import { useAuth, useAuthDispatch } from "../store/auth/context";
import { AuthActionFactory } from "../store/auth/actionCreator";

export function AuthObserver(props: {children: ReactNode}) {

    const auth = getAuth();
    const loggedUser = useAuth();
    const dispatch = useAuthDispatch();

    if (!loggedUser.isFirebaseAuthenticated && !loggedUser.user.uid) {
      onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          dispatch(AuthActionFactory.signIn(authUser, true));
        } else {
          dispatch(AuthActionFactory.signIn({} as User , true));
        }
      });
    }

    return (
        <>{props.children}</>
    )
}