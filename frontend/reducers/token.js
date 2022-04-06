import {createSlice} from "@reduxjs/toolkit";

const tokens = createSlice({
    name: 'tokens',
    initialState: {
        tokens: {
            access: '',
            refresh: '',
        },
        visitorId: ''
    },
    reducers: {
        set_access(state, action) {
            state.tokens.access = action.payload
        },
        set_refresh(state, action) {
            state.tokens.refresh = action.payload
        },
        set_tokens(state, action) {
            state.tokens.access = action.payload.access
            state.tokens.refresh = action.payload.refresh
        },
        setVisitorId(state, action) {
            state.visitorId = action.payload
        },
    },
});

export const {
    set_access, set_refresh, set_tokens, setVisitorId
} = tokens.actions;

export const token = tokens.reducer;
/*export {token}*/

