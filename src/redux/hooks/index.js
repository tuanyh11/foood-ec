import { useSelector } from "react-redux";
import {cartActions} from '../features/cartSlice'
import {reviewActions} from '../features/reviewSlice'
import {userLogin, userLogout} from '../features/authSlice'
import {checkoutActions} from '../features/checkoutSlice'
import {orderActions} from '../features/ordersSlice'
import {useDispatch } from 'react-redux'

// review action



export const useCartSlice = () => {
    const dispatch = useDispatch()

    const cartProducts = useSelector(state => state.userData.cart)

    return [cartProducts, cartActions, dispatch]
}

export const useReviewSlice = () => {

    const reviewProducts = useSelector(state => state.reviews)

    return [reviewProducts, reviewActions]

}

export const useAuthSlice = () => {
    
    const dispatch = useDispatch()

    const auth = useSelector(state => state.userData.user.data)

    return [auth, {userLogin, userLogout}, dispatch]
}

export const useCheckoutSlice = () => {
    
    const dispatch = useDispatch()

    const checkout = useSelector(state => state.checkout)

    return [checkout, checkoutActions, dispatch]
}

export const useOrderSlice = () => {
    
    const dispatch = useDispatch()

    const checkout = useSelector(state => state.orders)

    return [checkout, orderActions, dispatch]
}
