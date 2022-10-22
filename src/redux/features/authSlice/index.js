import  {createSlice} from '@reduxjs/toolkit' 



const initialState = {
    data: null
}



const authSlice = createSlice({
    initialState,
    name: 'auth',
    reducers: {
        userLogin: (state, action) => {
           state.data = action.payload
        },
        userLogout: (state, action) => {
            localStorage.clear()
        }
    }
})

export const {userLogin, userLogout} = authSlice.actions

export default authSlice.reducer