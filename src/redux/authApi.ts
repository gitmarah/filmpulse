import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQueryWithReAuth";
import type { RefreshReturnType, SignInFormType } from "../components/types";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        signUpUser: builder.mutation({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData
            })
        }),
        signInUser: builder.mutation<RefreshReturnType, SignInFormType>({
            query: (credentials) => ({
                url: "/auth",
                method: "POST",
                body: credentials
            })
        }),
        signOutUser: builder.mutation({
            query: () => ({
                url: "/signout",
                method: "POST"
            })
        }),
        getUser: builder.query({
            query: (id: string) => `/users/${id}`,
            providesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: (userData) => ({
                url: "/users",
                method: "POST",
                body: userData
            }),
            invalidatesTags: ['User']
        }),
        verifyUser: builder.query({
            query: (token) => `verify/${token}`
        })
    })
});

export const {
    useSignUpUserMutation,
    useSignOutUserMutation,
    useSignInUserMutation,
    useGetUserQuery,
    useVerifyUserQuery,
    useUpdateUserMutation
} = authApi
