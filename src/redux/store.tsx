import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducers/userReducer";
import { productAPI } from "./api/productAPI";
import { cartReducer } from "./reducers/cartReducer";
import { orderApi } from "./api/orderAPI";
import { dashboardApi } from "./api/dashboardAPI";
import { Coupon } from "./api/couponAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [Coupon.reducerPath]: Coupon.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (mid) => [...mid(), userAPI.middleware, productAPI.middleware,
    orderApi.middleware, dashboardApi.middleware, Coupon.middleware]
})