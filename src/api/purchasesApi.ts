import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {IPurchase} from "@/types/purchase.type.ts";

function toCamelCase(obj: any): any {
    if (Array.isArray(obj)) return obj.map(toCamelCase);
    if (obj !== null && obj.constructor === Object) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, val]) => [
                key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
                toCamelCase(val),
            ])
        );
    }
    return obj;
}

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3001/v1/purchases",
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const purchasesApi = createApi({
    reducerPath: "purchasesApi",
    baseQuery,
    tagTypes: ["Purchases"],
    endpoints: (builder) => ({
        // POST /
        createPurchase: builder.mutation<IPurchase, Partial<IPurchase>>({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Purchases"],
        }),

        // GET /
        getAllPurchases: builder.query<IPurchase[], void>({
            query: () => "/",
            transformResponse: (response: any) => toCamelCase(response),
            providesTags: ["Purchases"],
        }),

        // GET /user/:id
        getPurchasesByUserId: builder.query<IPurchase[], number>({
            query: (userId) => `/user/${userId}`,
            transformResponse: (response: any) => toCamelCase(response),
            providesTags: (_result, _error, userId) => [{ type: "Purchases", id: userId }],
        }),
    }),
});

export const {
    useCreatePurchaseMutation,
    useGetAllPurchasesQuery,
    useGetPurchasesByUserIdQuery,
} = purchasesApi;
