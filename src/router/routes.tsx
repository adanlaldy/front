import Tutorial from "../components/tutorial.tsx";
import NotFound from "../components/not-found.tsx";
import {RouteObject} from "react-router-dom";

const myRoutes: RouteObject[] = [
    {
        path: "/",
        children: [
            {
                path: "tutorial",
                element: <Tutorial/>
            },
            {
                path: "*",
                element: <NotFound/>
            }
        ]
    }
]

export default myRoutes