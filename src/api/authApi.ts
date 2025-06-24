import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3001/v1/users",
    credentials: "include",
});

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<
            { token: string; message: string },
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

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;
