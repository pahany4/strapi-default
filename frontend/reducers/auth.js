import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuth: null,
    },
    reducers: {
        setAuth(state, action) {
            return ({
                ...state, isAuth: action.payload
            })
        },
    },
});

export const {setAuth} = authSlice.actions;

export const auth = authSlice.reducer;
