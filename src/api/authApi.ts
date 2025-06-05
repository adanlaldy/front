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
    }),
});

export const { useLoginMutation } = authApi;
