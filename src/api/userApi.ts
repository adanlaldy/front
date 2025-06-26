import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser } from "../types/user.type.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3001/v1/users",
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery,
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        // GET /users
        getAllUsers: builder.query<IUser[], void>({
            query: () => "/",
            providesTags: ["Users"],
        }),

        // GET /users/:id
        getUserById: builder.query<IUser, number>({
            query: (id) => `/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Users", id }],
        }),

        // POST /users/
        createUser: builder.mutation<IUser, Partial<IUser>>({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Users"],
        }),

        // PUT /users/update/:id
        updateUserById: builder.mutation<IUser, { id: number; data: Partial<IUser> }>({
            query: ({ id, data }) => ({
                url: `/update/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: "Users", id }],
        }),

        // DELETE /users/:id
        deleteUserById: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, id) => [{ type: "Users", id }],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserByIdMutation,
    useDeleteUserByIdMutation,
} = usersApi;
