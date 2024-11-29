import { User } from "firebase/auth"

export const AuthActions = {
    LOGIN: 'auth/login' as const,
    LOGOUT: 'auth/logout' as const,
    FIREBASE_AUTHENTICATED: 'auth/firebaseAuthenticated' as const
}

export const AuthActionFactory = {
    signIn: (user: User, isFirebaseAuthenticated?: boolean) => ({
        type: AuthActions.LOGIN,
        payload: {
            user,
            isFirebaseAuthenticated,
            isAnonymousUser: user.isAnonymous
        }
    }),

    signOut: () => ({
        type: AuthActions.LOGOUT,
        payload: {
            user: null,
            isFirebaseAuthenticated: false,
            isAnonymousUser: false
        }
    }),

    firebaseAuthenticated: (isAuthenticated: boolean) => ({
        type: AuthActions.FIREBASE_AUTHENTICATED,
        payload: {
            isAuthenticated
        }
    })
}

export type AuthReduxAction = ReturnType<typeof AuthActionFactory.signIn> | ReturnType<typeof AuthActionFactory.signOut> | ReturnType<typeof AuthActionFactory.firebaseAuthenticated>;