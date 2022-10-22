import { DefaultLayout, EmptyLayout } from "../components";
import {Home, FoodDetail, AllFoods, Cart, Checkout, Orders, Login, UserProfile} from '../pages'
import Register from "../pages/Register";


export const publicRoutes = [
    {path: "/foods/:id", component: FoodDetail, layout: DefaultLayout},
    {path: "/home", component: Home, layout: DefaultLayout},
    {path: "/foods", component: AllFoods, layout: DefaultLayout},
    {path: "/cart", component: Cart, layout: DefaultLayout},
    {path: "/checkout", component: Checkout, layout: DefaultLayout},
    {path: "/orders", component: Orders, layout: DefaultLayout},
    {path: "/login", component: Login, layout: EmptyLayout},
    {path: "/register", component: Register, layout: EmptyLayout},
] 

export const privateRoutes = [
    {path: "/user-profile", component: UserProfile, layout: EmptyLayout},

]