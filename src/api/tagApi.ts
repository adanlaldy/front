import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ITag } from "../types/tag.type.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000/v1/tags",
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const tagApi = createApi({
    reducerPath: "tagApi",
    baseQuery,
    tagTypes: ["Tags"],
    endpoints: (builder) => ({
        // GET /tags
        getAllTags: builder.query<ITag[], void>({
            query: () => "/",
            providesTags: ["Tags"],
        }),

        // GET /tags/:id
        getTagById: builder.query<ITag, number>({
            query: (id) => `/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Tags", id }],
        }),

        // POST /tags
        createTag: builder.mutation<ITag, Partial<ITag>>({
            query: (body) => ({
                url: `/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Tags"],
        }),

        // PUT /tags/:id
        updateTagById: builder.mutation<ITag, { id: number; data: Partial<ITag> }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: "Tags", id }],
        }),

        // DELETE /tags/:id
        deleteTagById: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, id) => [{ type: "Tags", id }],
        }),

        // GET /tags/post/:postId
        getTagsByPostId: builder.query<ITag[], number>({
            query: (postId) => `/post/${postId}`,
            providesTags: (_result, _err, postId) => [{ type: "Tags", id: postId }],
        }),

        // DELETE /tags/post/:postId
        deleteTagByPostId: builder.mutation<{ success: boolean }, number>({
            query: (postId) => ({
                url: `/post/${postId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, postId) => [{ type: "Tags", id: postId }],
        }),
    }),
});

export const {
    useGetAllTagsQuery,
    useGetTagByIdQuery,
    useCreateTagMutation,
    useUpdateTagByIdMutation,
    useDeleteTagByIdMutation,
    useGetTagsByPostIdQuery,
    useDeleteTagByPostIdMutation,
} = tagApi;
