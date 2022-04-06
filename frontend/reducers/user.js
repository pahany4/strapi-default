import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        first_name: null,
        last_name: null,
        patronymic: null,
        email: null,
        phone: null,
        is_active: null,
        is_fully_confirmed: null,
        role: null,
        date_joined: null,
        is_staff: null
    },
    reducers: {
        /** Установка данных по user-у с сервера */
        setUser(state, action) {
            return (
                action.payload
            )
        },
    },
});

export const {setUser} = userSlice.actions;

export const user = userSlice.reducer;
