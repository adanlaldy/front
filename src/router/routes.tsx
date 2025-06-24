import Tutorial from "../components/tutorial.tsx";
import NotFound from "../components/not-found.tsx";
import Login from '../Login';
import Register from '../Register';
import {RouteObject} from "react-router-dom";
import Header from "../components/header.tsx";

const myRoutes: RouteObject[] = [
    {
        path: "/",
        children: [
            {
                path: "tutorial",
                element: <Tutorial/>
            },
            {
                path: 'login',
                // index: true,
                element: <Login/>,
            },
            {
                path: "*",
                element: <NotFound/>
            },
            {
                path: 'register',
                element: <Register/>,
            },
            {
                path: "test",
                element: <Header pageName={"test"}/>
            }
        ]
    }
]

export default myRoutes