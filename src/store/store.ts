import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {authApi} from "../api/authApi.ts";
import {notificationsApi} from "../api/notificationsApi.ts";
import { registerApi } from "../api/authApi.ts";
import {auctionApi} from "../api/auctionsApi.ts";
import {picturesApi} from "../api/picturesApi.ts";
import {fileApi} from "../api/fileApi.ts";
import {tagApi} from "../api/tagApi.ts";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,
        [registerApi.reducerPath]: registerApi.reducer,
        [auctionApi.reducerPath]: auctionApi.reducer,
        [picturesApi.reducerPath]: picturesApi.reducer,
        [fileApi.reducerPath]: fileApi.reducer,
        [tagApi.reducerPath]: tagApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            notificationsApi.middleware,
            registerApi.middleware,
            auctionApi.middleware,
            picturesApi.middleware,
            fileApi.middleware,
            tagApi.middleware
        ),
});

setupListeners(store.dispatch)
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>