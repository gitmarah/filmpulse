import { createSlice } from "@reduxjs/toolkit";

type UserType = {
    createdAt: string | null,
    email: string | null,
    favmov: string[] | null,
    firstname: string | null,
    imageUrl: string | null,
    lastname: string | null,
    password: string | null,
    profilephoto: string | null,
    refreshToken: string | null,
    roles: number[] | null,
    updatedAt: string | null,
    verified: boolean | null,
    __v: number | null,
    _id: string | null,
}

type favoriteType = {
    userId: string | null,
    movieId: number | null,
    type: string | null,
    poster: string | null,
    title: string | null,
    status: string | null,
    release_date: string | null,
    checked: boolean | null,
    __v: number | null,
    _id: string | null,
}

type initialStateType = {
    user: UserType | null,
    watchlist: favoriteType[] | null
}
const initialState: initialStateType = {
    user: null,
    watchlist: null
}

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action) => {
            return {
                ...state,
                user: action.payload.data
            }
        },
        setWatchList: (state, action) => {
            return {
                ...state,
                watchlist: action.payload.data
            }
        },
        clearUser: (state) => {
            return {
                ...state,
                user: null
            }
        }
    }
})

export const {setUser, clearUser, setWatchList} = userSlice.actions
export const userReducer = userSlice.reducer