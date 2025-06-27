import Tutorial from "../components/tutorial.tsx";
import NotFound from "../components/not-found.tsx";
import Login from '../components/Login.tsx';
import Register from '../components/Register.tsx';
import {RouteObject} from "react-router-dom";
import HomePage from "../components/Home.tsx";
import Header from "../components/header.tsx";
import AuctionHouse from "../components/auction-house.tsx";
import CreateAuction from "../components/create-auction.tsx";
import ProtectedRoute from "../components/protected-route.tsx";
import AdminLayout from "../components/admin-layout.tsx";
import UsersPage from "@/components/back-office/users-page.tsx";
import PurchasesPage from "@/components/back-office/purchases-page.tsx";

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
            },
            {
                path: "home",
                element: <HomePage/>
            },
            {
                path: "auction-house",
                element: <AuctionHouse/>
            },
            {
                path: 'create-auction',
                element: <CreateAuction/>
            },
            {
                path: "/back-office",
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "",
                        element: <AdminLayout />,
                        children: [
                            { path: "users", element: <UsersPage /> },
                            { path: "purchases", element: <PurchasesPage /> },
                            // { path: "conversations", element: <ConversationsPage /> },
                            // { path: "messages", element: <MessagesPage /> },
                            // { path: "auctions", element: <AuctionsPage /> },
                        ]
                    }
                ]
            }

        ]
    }
]

export default myRoutes