import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface MainState {
    userIsLoggedIn: boolean,
}

const initialState: MainState = {
    userIsLoggedIn: false,
}

export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setUserIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.userIsLoggedIn = action.payload
        }
    }
})