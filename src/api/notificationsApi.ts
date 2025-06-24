import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {INotification} from "../types/notification.type.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3001/v1/notifications",
    credentials: "include",
});

export const notificationsApi = createApi({
    reducerPath: "notificationsApi",
    baseQuery,
    endpoints: (builder) => ({
        getNotificationsByUserId: builder.query<
            any, // à adapter selon la structure de tes notifications
            number // userId en paramètre
        >({
            query: (userId) => `/user/${userId}`,
        }),

        // Met à jour une notif par ID
        updateNotificationById: builder.mutation<INotification, { id: number; data: Partial<INotification> }>({
            query: ({ id, data }) => ({
                url: `/update/${id}`,
                method: "PATCH",
                body: data,
            }),
        }),
    }),
});

export const { useGetNotificationsByUserIdQuery, useUpdateNotificationByIdMutation } = notificationsApi;
