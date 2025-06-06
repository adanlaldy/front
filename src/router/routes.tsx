import Tutorial from "../components/tutorial.tsx";
import NotFound from "../components/not-found.tsx";
import Login from '../components/Login.tsx';
import Register from '../components/Register.tsx';
import { RouteObject } from "react-router-dom";

const myRoutes: RouteObject[] = [
    {
        path: "/",
        children: [
            {
                path: "tutorial",
                element: <Tutorial />
            },
            {
                path: 'login',
                // index: true,
                element: <Login />,
            },
            {
                path: "*",
                element: <NotFound />
            },
            {
                path: 'register',
                element: <Register />,
            }
        ]
    }
]

export default myRoutes