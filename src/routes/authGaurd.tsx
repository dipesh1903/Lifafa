import { useAuth } from "../store/auth/context"
import { Navigate } from "react-router-dom";
import HomePage from "../pages/Home";


export const AuthGaurd = () => {
    // const auth = getAuth();
    // const dispatch = useAuthDispatch();
    const authUser = useAuth();

    // useEffect(() => {
    //     if(authUser && authUser.user.uid) {
    //         
    //     } else {
    //         
    //     }
    // }, [authUser])
    
    if (authUser && !authUser.isFirebaseAuthenticated) {
        return <div>Loading....</div>
    }
    else if(authUser && authUser.user.uid) {
        return <HomePage />;
    } else {
        
        return <Navigate to='/login'/>
    }
    // onAuthStateChanged(auth, (authUser) => {
    //   
    //   if (authUser) {
    //     dispatch(AuthActionFactory.signIn(authUser));
    //     return <Outlet></Outlet>;
    //   } else {
    //     dispatch(AuthActionFactory.signOut());
    //     return <Navigate to='/login' replace state={{from: location}}/>
    //   }
    // });
}

