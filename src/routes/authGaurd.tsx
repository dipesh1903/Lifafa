import { useAuth } from "../store/auth/context"
import { Navigate, useLocation } from "react-router-dom";
import HomePage from "../pages/Home";


export const AuthGaurd = () => {
    const location = useLocation();
    const authUser = useAuth();
    
    if (authUser && (!authUser.isFirebaseAuthenticated && !authUser.isAnonymousUser)) {
        return <div>Loading....</div>
    }
    else if(authUser && authUser.user.uid) {
        return <HomePage />;
    } else {
        return <Navigate to={`/login?redirectLink=${location.pathname}`}/>
    }
}

