import { createSlice } from "@reduxjs/toolkit";
import gettingUserName, { gettingUserEmail } from "../../Components/GettingUserDetail";

type UserState = {
    name: string;   
    email: string;
}
const initialState:UserState = {
    name: '',
    email: '',
    // profilePic: 'https://via.placeholder.com/100', // Placeholder, replace with actual logic
};

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers:{
        updateName:(state, action) => {
            state.name = action.payload.name;
        }
    }

});           

export const {updateName} = userSlice.actions;
export default userSlice.reducer;