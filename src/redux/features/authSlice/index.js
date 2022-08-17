import  {createSlice} from '@reduxjs/toolkit' 



const initialState = {

}



const authSlice = createSlice({
    initialState,
    name: 'auth',
    reducers: {
        userLogin: (state, action) => {
           state.userInfo = action.payload
        },
        userLogout: (state, action) => {
            localStorage.clear()
        }
    }
})

export const authActions = authSlice.actions

export default authSlice.reducer