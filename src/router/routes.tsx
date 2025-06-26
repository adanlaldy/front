import Tutorial from "../components/tutorial.tsx";
import NotFound from "../components/not-found.tsx";
import Login from '../components/Login.tsx';
import Register from '../components/Register.tsx';
import { RouteObject } from "react-router-dom";
import HomePage from "../components/Home.tsx";
import Header from "../components/header.tsx";
import AuctionHouse from "../components/auction-house.tsx";
import CreateAuction from "../components/create-auction.tsx";

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
                element: <Header pageName={"test"}/>
            },
            {
                path: "home",
                element: <HomePage />
            },
            {
                path: "auction-house",
                element: <AuctionHouse/>
            },
            {
                path: 'create-auction',
                element: <CreateAuction/>
            }
        ]
    }
]

export default myRoutes