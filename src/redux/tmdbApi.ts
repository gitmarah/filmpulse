import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY = "12cf965b57537df561d0aaa18587d6ac"

export const tmdbApi = createApi({
    reducerPath: "tmdbApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.themoviedb.org/3"
    }),
    endpoints: (builder) => ({
        getTopRatedMovies: builder.query({
            query: (page: number = 1) => ({
                url: "/movie/top_rated",
                params: {
                    api_key: API_KEY,
                    page
                }
            })
        }),
        getPopularMovies: builder.query({
            query: (page: number = 1) => ({
                url: "/movie/popular",
                params: {
                    api_key: API_KEY,
                    page
                }
            })
        }),
        getMovie: builder.query({
            query: (id: string) => ({
                url: `/movie/${id}`,
                params: {
                    api_key: API_KEY
                }
            })
        }),
        searchMovie: builder.query({
            query: (title: string) => ({
                url: `/search/movie`,
                params: {
                    api_key: API_KEY,
                    query: title
                }
            })
        }),
        searchShow: builder.query({
            query: (title: string) => ({
                url: `/search/tv`,
                params: {
                    api_key: API_KEY,
                    query: title
                }
            })
        }),
        getShow: builder.query({
            query: (id: string) => ({
                url: `/tv/${id}`,
                params: {
                    api_key: API_KEY
                }
            })
        }),
        getUpcomingMovies: builder.query({
            query: (page: number = 1) => ({
                url: "/movie/upcoming",
                params: {
                    api_key: API_KEY,
                    page
                }
            })
        }),
        getMovies: builder.query({
            query: ({page = 1, type}) => ({
                url: `/movie/${type}`,
                params: {
                    api_key: API_KEY,
                    page
                }
            })
        }),
        getShows: builder.query({
            query: ({page = 1, type}) => ({
                url: `/tv/${type}`,
                params: {
                    api_key: API_KEY,
                    page
                }
            })
        }),
        getPopularShows: builder.query({
            query: (page: number = 1) => ({
                url: "/tv/popular",
                params: {
                    api_key: API_KEY,
                    page
                }
            })
        }),
        getTopRatedShows: builder.query({
            query: (page: number = 1) => ({
                url: "/tv/top_rated",
                params: {
                    api_key: API_KEY,
                    page
                }
            })
        }),
    })
});


export const {
    useGetUpcomingMoviesQuery,
    useGetPopularMoviesQuery,
    useGetPopularShowsQuery,
    useGetTopRatedShowsQuery,
    useGetTopRatedMoviesQuery,
    useGetMovieQuery,
    useGetMoviesQuery,
    useGetShowsQuery,
    useGetShowQuery,
    useSearchMovieQuery,
    useSearchShowQuery
} = tmdbApi