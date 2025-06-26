import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3001/v1/users",
    credentials: "include", // très important pour envoyer les cookies
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

export const registerApi = createApi({
    reducerPath: "registerApi",
    baseQuery,
    endpoints: (builder) => ({
        register: builder.mutation<
            { message: string },
            { firstName: string; lastName: string; birthDate: Date; email: string; password: string; role: "user" }
        >({
            query: (body) => ({
                url: "/register",
                method: "POST",
                body, // ici on envoie le body
            }),
        }),
    }),
});


export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<
            { token: string; message: string; user: { id: number; role: string; first_name: string; last_name: string } },
            { email: string; password: string }
        >({
            query: (body) => ({
                url: "/login",
                method: "POST",
                body, // ici on envoie le body
            }),
        }),

        getCurrentUser: builder.query<
            { id: string; email: string; name: string },
            void
        >({
            query: () => ({
                url: "/me",
                method: "GET",
            }),
        }),
    }),
});

export const { useRegisterMutation } = registerApi;

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;

