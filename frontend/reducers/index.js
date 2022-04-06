import { configureStore } from "@reduxjs/toolkit"
import {auth} from "./auth";
import {user} from "./user";
import {token} from "./token";

export default configureStore({
    reducer: {
        auth,
        user,
        token,
    },
    /** Отключение redux devtools в production */
    devTools: process.env.NODE_ENV === "development",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }),
});
