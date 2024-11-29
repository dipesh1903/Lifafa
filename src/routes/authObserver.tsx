import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { ReactNode } from "react";
import { useAuth, useAuthDispatch } from "../store/auth/context";
import { AuthActionFactory } from "../store/auth/actionCreator";
import { LifafaActionFactory } from "../store/lifafas/actionCreator";
import { useLifafaDispatch } from "../store/lifafas/context";

export function AuthObserver(props: {children: ReactNode}) {

    const auth = getAuth();
    const loggedUser = useAuth();
    const dispatch = useAuthDispatch();
    const lifafaDispatch = useLifafaDispatch();

    if (!loggedUser.isFirebaseAuthenticated && !loggedUser.isAnonymousUser && !loggedUser.user.uid) {
      onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          dispatch(AuthActionFactory.signIn(authUser, true));
        } else {
          signInAnonymously(auth)
          .then((res) => {
              dispatch(AuthActionFactory.signIn(res.user, true))
              lifafaDispatch(LifafaActionFactory.deleteAllLifafa());
          })
        }
      });
    }

    return (
        <>{props.children}</>
    )
}