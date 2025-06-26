import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IFile } from "../types/file.type.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000/v1/files",
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const fileApi = createApi({
    reducerPath: "fileApi",
    baseQuery,
    tagTypes: ["Files"],
    endpoints: (builder) => ({
        // GET /files
        getAllFiles: builder.query<IFile[], void>({
            query: () => "/",
            providesTags: ["Files"],
        }),

        // GET /files/:id
        getFileById: builder.query<IFile, number>({
            query: (id) => `/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Files", id }],
        }),

        // GET /files/:content_type
        getFilesByContentType: builder.query<IFile[], string>({
            query: (contentType) => `/${contentType}`,
            providesTags: (_result, _err, contentType) => [{ type: "Files", id: contentType }],
        }),

        // POST /files
        createFile: builder.mutation<IFile, Partial<IFile>>({
            query: (body) => ({
                url: `/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Files"],
        }),

        // PUT /files/:id
        updateFileById: builder.mutation<IFile, { id: number; data: Partial<IFile> }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: "Files", id }],
        }),

        // DELETE /files/:id
        deleteFileById: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _err, id) => [{ type: "Files", id }],
        }),
    }),
});

export const {
    useGetAllFilesQuery,
    useGetFileByIdQuery,
    useGetFilesByContentTypeQuery,
    useCreateFileMutation,
    useUpdateFileByIdMutation,
    useDeleteFileByIdMutation,
} = fileApi;
