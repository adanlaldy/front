import Tutorial from "../components/tutorial.tsx";
import NotFound from "../components/not-found.tsx";
import Login from '../components/Login.tsx';
import Register from '../components/Register.tsx';
import { RouteObject } from "react-router-dom";
import HomePage from "../components/Home.tsx";
import Header from "../components/header.tsx";
import ConversationsPage from "../components/conversations.tsx";
import Messages from "../components/messages.tsx";

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
                element: <Header pageName={"test"} />
            },
            {
                path: "home",
                element: <HomePage />
            },
            {
                path: "messages",
                element: <ConversationsPage /> // This is the messages page
            },
            {
                path: "messages/conversation/:id",
                element: <Messages /> // This is the conversation detail page
            }
        ]
    }
]

export default myRoutes