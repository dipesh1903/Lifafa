import { useAuth } from "../store/auth/context"
import { Navigate } from "react-router-dom";
import HomePage from "../pages/Home";


export const AuthGaurd = () => {
    // const auth = getAuth();
    // const dispatch = useAuthDispatch();
    const authUser = useAuth();

    // useEffect(() => {
    //     if(authUser && authUser.user.uid) {
    //         console.log('logged in user')
    //     } else {
    //         console.log('not logegd in user')
    //     }
    // }, [authUser])
    console.log('authuser', authUser);
    if (authUser && !authUser.isFirebaseAuthenticated) {
        return <div>Loading....</div>
    }
    else if(authUser && authUser.user.uid) {
        return <HomePage />;
    } else {
        console.log('login page called')
        return <Navigate to='/login'/>
    }
    // onAuthStateChanged(auth, (authUser) => {
    //   console.log('auth state changes' , authUser);
    //   if (authUser) {
    //     dispatch(AuthActionFactory.signIn(authUser));
    //     return <Outlet></Outlet>;
    //   } else {
    //     dispatch(AuthActionFactory.signOut());
    //     return <Navigate to='/login' replace state={{from: location}}/>
    //   }
    // });
}

