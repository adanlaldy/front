import Tutorial from "../components/tutorial.tsx";
import NotFound from "../components/not-found.tsx";
import Login from '../components/Login.tsx';
import Register from '../components/Register.tsx';
import { RouteObject } from "react-router-dom";
import Sidebar from "../components/sidebar.tsx";
import HomePage from "../components/Home.tsx";

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
            },
            {
                path: "test",
                element: <Sidebar />
            },
            {
                path: "home",
                element: <HomePage />
            }
        ]
    }
]

export default myRoutes