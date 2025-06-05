import { fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { clearCredentials, setCredentials } from "./authSlice";
import type { RefreshReturnType } from "../components/types";


const baseQuery = fetchBaseQuery({
    baseUrl: "https://filmpulseserver.onrender.com",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if(token){
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

export const baseQueryWithReAuth: BaseQueryFn = async (
    args, api, extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);
    if(result.error?.status === 401){
        const refreshResult = await baseQuery("/refresh", api, extraOptions);
        if(refreshResult?.data){
            const data = refreshResult?.data as RefreshReturnType
            api.dispatch(setCredentials({user: data?.user, token: data?.token}))
            result = await baseQuery(args, api, extraOptions);
        } else {
            await baseQuery("/signout", api, extraOptions);
            api.dispatch(clearCredentials());
        }
    }
    return result;
}