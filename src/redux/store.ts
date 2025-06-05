import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { authApi } from "./authApi";
import { tmdbApi } from "./tmdbApi";
import { userReducer } from "./userSlice";
import { userApi } from "./userApi";

export const store = configureStore({
    reducer: {
        [tmdbApi.reducerPath]: tmdbApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
        user: userReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware).concat(tmdbApi.middleware).concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch