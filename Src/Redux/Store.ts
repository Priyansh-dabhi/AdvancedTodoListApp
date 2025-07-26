import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./Slices/User";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    user: userSlice,
});

const store = configureStore({
    reducer: rootReducer,
})

export default store;