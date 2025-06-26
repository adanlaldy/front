import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPicture } from "../types/picture.type.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000/v1/pictures",
    credentials: "include",
});

export const picturesApi = createApi({
    reducerPath: "picturesApi",
    baseQuery,
    tagTypes: ["Pictures"],
    endpoints: (builder) => ({
        // GET /pictures
        getAllPictures: builder.query<IPicture[], void>({
            query: () => "/",
            providesTags: ["Pictures"],
            transformResponse: (response: { data: string }) => {
                // response.data est la chaîne base64 reçue
                const jsonString = decodeURIComponent(escape(atob(response.data)));
                return JSON.parse(jsonString);
            },
        }),


        // GET /pictures/id/:id
        getPictureById: builder.query<IPicture, number>({
            query: (id) => `/id/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Pictures", id }],
            transformResponse: (response: { data: string }) => {
                const jsonString = decodeURIComponent(escape(atob(response.data)));
                return JSON.parse(jsonString);
            },
        }),

        // GET /pictures/auction/:auction_id
        getPicturesByAuctionId: builder.query<IPicture[], number>({
            query: (auction_id) => `/auction/${auction_id}`,
            providesTags: (_result, _err, auction_id) => [
                { type: "Pictures", id: `auction-${auction_id}` },
            ],
            transformResponse: (response: { data: string }) => {
                const jsonString = decodeURIComponent(escape(atob(response.data)));
                return JSON.parse(jsonString);
            },
        }),

        // POST /pictures
        createNewPicture: builder.mutation<IPicture, Partial<IPicture>>({
            query: (body) => {
                const jsonString = JSON.stringify(body);
                const base64Body = btoa(unescape(encodeURIComponent(jsonString)));

                return {
                    url: `/`,
                    method: "POST",
                    body: { data: base64Body },  // ici tu peux envoyer ça selon ce que ton API attend
                };
            },
            invalidatesTags: ["Pictures"],
        }),

        // PUT /pictures/id/:id
        updatePictureById: builder.mutation<IPicture, { id: number; data: Partial<IPicture> }>({
            query: ({ id, data }) => ({
                url: `/id/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: "Pictures", id }],
        }),

        // DELETE /pictures/id/:id
        deletePictureById: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/id/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, id) => [{ type: "Pictures", id }],
        }),

        // DELETE /pictures/auction/:auction_id
        deletePicturesByAuctionId: builder.mutation<{ success: boolean }, number>({
            query: (auction_id) => ({
                url: `/auction/${auction_id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, auction_id) => [
                { type: "Pictures", id: `auction-${auction_id}` },
            ],
        }),
    }),
});

export const {
    useGetAllPicturesQuery,
    useGetPictureByIdQuery,
    useGetPicturesByAuctionIdQuery,
    useCreateNewPictureMutation,
    useUpdatePictureByIdMutation,
    useDeletePictureByIdMutation,
    useDeletePicturesByAuctionIdMutation,
} = picturesApi;
