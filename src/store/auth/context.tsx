import { createContext, Dispatch, useContext, useReducer } from 'react';
import { AuthInitialStateType, AuthReducer, initialState } from './reducer';
import { AuthReduxAction } from './actionCreator';

type UserProviderProps = {
    children: React.ReactNode;
  };

const AuthContext = createContext<AuthInitialStateType>({});
const AuthContextDispatch = createContext<Dispatch<AuthReduxAction> | null>(null);

export default function AuthContextProvider(prop: UserProviderProps) {
  const [user , dispatch] = useReducer(AuthReducer, initialState);
  return (
    <AuthContext.Provider value={user}>
      <AuthContextDispatch.Provider value={dispatch}>
        {prop.children}
      </AuthContextDispatch.Provider>
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthInitialStateType {
  const context = useContext(AuthContext);
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthDispatch(): Dispatch<AuthReduxAction>  {
  const context = useContext(AuthContextDispatch);
  return context as Dispatch<AuthReduxAction>;
}