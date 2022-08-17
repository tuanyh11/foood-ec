import { DefaultLayout } from "../components";
import {Home, FoodDetail, AllFoods, Cart, Checkout, Orders} from '../pages'


export const publicRoutes = [
    {path: "/foods/:id", component: FoodDetail, layout: DefaultLayout},
    {path: "/home", component: Home, layout: DefaultLayout},
    {path: "/foods", component: AllFoods, layout: DefaultLayout},
    {path: "/cart", component: Cart, layout: DefaultLayout},
    {path: "/checkout", component: Checkout, layout: DefaultLayout},
    {path: "/orders", component: Orders, layout: DefaultLayout},
    
] 