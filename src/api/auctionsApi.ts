import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IAuction } from "../types/auction.type.ts";

// Transforme les clés snake_case en camelCase
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
    baseUrl: "http://localhost:3000/v1/auction",
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const auctionsApi = createApi({
    reducerPath: "auctionsApi",
    baseQuery,
    tagTypes: ["Auctions"],
    endpoints: (builder) => ({
        // GET /auctions
        getAllAuctions: builder.query<IAuction[], void>({
            query: () => "/",
            transformResponse: (response: any) => toCamelCase(response),
            providesTags: ["Auctions"],
        }),

        // GET /auctions/:id
        getAuctionById: builder.query<IAuction, number>({
            query: (id) => `/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Auctions", id }],
        }),

        // POST /auctions
        createAuction: builder.mutation<IAuction, Partial<IAuction>>({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Auctions"],
        }),

        // PUT /auctions/:id
        updateAuctionById: builder.mutation<IAuction, { id: number; data: Partial<IAuction> }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: "Auctions", id }],
        }),

        // DELETE /auctions/:id
        deleteAuctionById: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, id) => [{ type: "Auctions", id }],
        }),

        // GET /auctions/price-range
        getAuctionsByPriceRange: builder.query<IAuction[], { min: number; max: number }>({
            query: ({ min, max }) => `/price-range?min=${min}&max=${max}`,
            transformResponse: (response: any) => toCamelCase(response),
            providesTags: ["Auctions"],
        }),
    }),
});

export const {
    useGetAllAuctionsQuery,
    useGetAuctionByIdQuery,
    useCreateAuctionMutation,
    useUpdateAuctionByIdMutation,
    useDeleteAuctionByIdMutation,
    useGetAuctionsByPriceRangeQuery,
} = auctionsApi;
