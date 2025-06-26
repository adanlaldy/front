import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IAuction } from "../types/auction.type.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000/v1/auction",
    credentials: "include",
});

export const auctionApi = createApi({
    reducerPath: "auctionApi",
    baseQuery,
    endpoints: (builder) => ({
        // GET /
        getAllAuctions: builder.query<IAuction[], void>({
            query: () => "/",
        }),

        // POST /
        createAuction: builder.mutation<IAuction, Partial<IAuction>>({
            query: (newAuction) => ({
                url: "/",
                method: "POST",
                body: newAuction,
            }),
        }),

        // GET /price-range
        getAuctionsByPriceRange: builder.query<IAuction[], { min: number; max: number }>({
            query: ({ min, max }) => `/price-range?min=${min}&max=${max}`,
        }),

        // GET /:id
        getAuctionById: builder.query<IAuction, number>({
            query: (id) => `/${id}`,
        }),

        // DELETE /:id
        deleteAuctionById: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
        }),

        // PUT /:id
        updateAuctionById: builder.mutation<IAuction, { id: number; data: Partial<IAuction> }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetAllAuctionsQuery,
    useCreateAuctionMutation,
    useGetAuctionsByPriceRangeQuery,
    useGetAuctionByIdQuery,
    useDeleteAuctionByIdMutation,
    useUpdateAuctionByIdMutation,
} = auctionApi;
