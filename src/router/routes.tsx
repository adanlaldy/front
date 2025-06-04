import React from 'react';
import App from '../App';
import Login from '../Login';
import Register from '../Register';
import { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
    {
        path: '/',
        children: [
            {
                path: 'login',
                // index: true,
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            }
        ],
    },
];

export default routes;