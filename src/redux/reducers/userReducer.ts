import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userReducerInitialState } from "../../types/reducer-type";
import { MyUser } from "../../types/types";

const initialState: userReducerInitialState = {
    user: null,
    loading: false,
}

export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        userExist: (state, action: PayloadAction<MyUser>) => {
            state.loading = true,
                state.user = action.payload,
                state.loading = false

        },
        userNotExist: (state) => {
            state.loading = true,
                state.user = null,
                state.loading = false

        },
    }
})

export const { userExist, userNotExist } = userReducer.actions