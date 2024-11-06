import { Outlet, RouterProvider } from 'react-router-dom'
import router from './routes'
import AuthContextProvider from "./store/auth/context"
import { AuthObserver } from "./routes/authObserver"
import StoreProvider from './store'
import { ConfigContextProvider } from './store/config/context'

function App() {

  return (
      <AuthContextProvider>
        <StoreProvider>
          <ConfigContextProvider>
            <AuthObserver>
              <RouterProvider router={router}/>
              <Outlet/>
            </AuthObserver>
          </ConfigContextProvider>
        </StoreProvider>
      </AuthContextProvider>
  )
}

export default App;
