import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthGaurd } from "./authGaurd";
import Login from "../pages/Login";
import LifafaPage from "../pages/Lifafa";
import LifafaListDrawer from "../components/Drawers/Lifafa";
import LifafaHomeContent from "../pages/LifafaHomeContent";
import { MemoComp } from "../store/lifafas/context";
import CreateLifafaDialog from "../components/Dialogs/CreateLifafa";
import EditRatna from "../components/edit-ratna";



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
                    element: <CreateLifafaDialog/>
                  },
                  {
                    path: ':lifafaId/edit',
                    element: <CreateLifafaDialog/>
                  },
                ]
            },
            // {
            //   path: '/lifafa/create',
            //   element: <LifafaPage/>
            // },
            {
                path: 'lifafa/:lifafaId',
                element: <MemoComp><LifafaPage/></MemoComp>,
                children: [
                  {
                    path: 'ratna/:ratnaId/edit',
                    element: <EditRatna />
                  }
                ]
            },
            // {
            //     path: 'lifafa/list',
            //     element: <LifafaListDrawer />
            // },
            {
                path: '/lifafa/:lifafaId/ratna/:ratnaId/edit',
                element: ''
            },
            {
                path: '/favourites',
                element: ''
            },
            {
                path: 'tags',
                element: ''
            },
            {
                path: '/logout',
                element: ''
            }
        ]
      },
      {
        path: '*',
        element: <p>404 Error - Nothing here...</p>
      }
    ]
  );

  export default router;