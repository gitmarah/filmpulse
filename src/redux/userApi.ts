import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQueryWithReAuth";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['Favorite'],
    endpoints: (builder) => ({
        addFavorite: builder.mutation({
            query: (movieData) => ({
                url: "/favorite",
                method: "POST",
                body: movieData
            }),
            invalidatesTags: ['Favorite']
        }),
        getFavorite: builder.query({
            query: (userId) => ({
                url: `/favorite/${userId}`,
                method: "GET"
            }),
            providesTags: (result) => result ?
            [...result.map(({_id}: {_id: string}) => ({type: 'Favorite' as const, id: _id})), 'Favorite'] : ['Favorite']
        }),
        deleteFavorite: builder.mutation({
            query: (userId) => ({
                url: `/favorite/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: (result) => {
                return [{
                type: 'Favorite',
                id: result._id
            }]},
        }),
        checkFavorite: builder.mutation({
            query: ({movieId}) => ({
                url: "/favorite",
                method: "PATCH",
                body: {id: movieId}
            }),
            invalidatesTags: (result) => {
                return [{
                type: 'Favorite',
                id: result._id
            }]},
        })
    })
})

export const {
    useAddFavoriteMutation,
    useGetFavoriteQuery,
    useDeleteFavoriteMutation,
    useCheckFavoriteMutation
} = userApi