import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthGaurd } from "./authGaurd";
import Login from "../pages/Login";
import LifafaPage from "../pages/Lifafa";
import LifafaListDrawer from "../components/Drawers/Lifafa";
import LifafaHomeContent from "../pages/LifafaHomeContent";
import EditRatna from "../components/edit-ratna";
import CreateLifafaForm from "../components/create-edit-Lifafa/CreateLifafa";



const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Navigate to="/lifafa"/>
      },
      {
        path: '/login',
        element: <Login/>,
        index: true
      },
      {
        element: <AuthGaurd></AuthGaurd>,
        children: [
            {
                path: '/lifafa',
                element: <LifafaHomeContent/>,
                children: [
                  {
                    path: 'list',
                    element: <LifafaListDrawer />
                  },
                  {
                    path: 'create',
                    element: <CreateLifafaForm/>
                  },
                  {
                    path: ':lifafaId/edit',
                    element: <CreateLifafaForm/>
                  },
                ]
            },
            {
                path: 'lifafa/:lifafaId',
                element: <LifafaPage/>,
                children: [
                  {
                    path: 'ratna/:ratnaId/edit',
                    element: <EditRatna />
                  },
                  {
                    path: 'ratna/create',
                    element: <EditRatna />
                  }
                ]
            },
        ]
      },
      {
        path: '*',
        element: <p>404 Error - Nothing here...</p>
      }
    ]
  );

  export default router;