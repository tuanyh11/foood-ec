import { createSlice, createAsyncThunk, current} from '@reduxjs/toolkit'


const initialState = {
    products: [],
    totalAmount: 0,
    isCheckout: false,
    totalPayment: 0
}



const getTotalAmount = (state, action) => {
    state.totalAmount = state.products.reduce((a, b) => {
        return a + Number(b.quantity) * Number(b.price)
    }, 0)
} 

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            state.products = action.payload
            getTotalAmount(state)
        },
        handleQuantity(state, action) {
            state.products.map(cart => {
                if(cart.cartId === action.payload.cartId) {
                    cart.quantity = action.payload.quantity
                    return cart
                } 
                return cart
            })
            getTotalAmount(state, action)
        },

        deleteCart(state, action) {
            state.products = state.products.filter(product => product._id !== action.payload._id)
            getTotalAmount(state, action)
        },

        clearCart(state, action) {
            state.products = []
            getTotalAmount(state, action)
        },
        
        openCheckout(state, action) {
            state.isCheckout = action.payload
        },

        initCart(state, action) {
            state.products = action.payload.products
        }
    }
})



export const cartActions = cartSlice.actions

export default cartSlice.reducer