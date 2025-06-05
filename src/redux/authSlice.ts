import { createSlice } from "@reduxjs/toolkit";
import type { authSliceUserType } from "../components/types";

type initialStateType = {
    user: authSliceUserType;
    token: string | null, 
    isAuthLoading: boolean
}

const initialState: initialStateType = {
    user: null,
    token: null,
    isAuthLoading: true
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            return {...state,
            user: payload.user,
            token: payload.token, isAuthLoading: false}
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthLoading = false
        }
    }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;