import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cartReducerInitialState } from "../../types/reducer-type";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: cartReducerInitialState = {
    loading: false,
    ShippingInfo: {
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: 0
    },
    subtotal: 0,
    total: 0,
    shippingcharges: 0,
    tax: 0,
    discount: 0,
    cartItems: []
}

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;
            const index = state.cartItems.findIndex((i) => {
                return i.productId === action.payload.productId
            })

            if (index >= 0) { state.cartItems[index] = action.payload }
            else {
                state.cartItems.push(action.payload);
            }
            state.loading = false;

        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter((item) => {
                return item.productId !== action.payload
            })
            state.loading = false;

        },
        calculatePrice: (state) => {
            state.subtotal = state.cartItems.reduce((pre, curr) => {
                return pre + curr.price * curr.quantity;
            }, 0)

            state.shippingcharges = state.cartItems.length > 0 && state.subtotal < 1000 ? 100 : 0;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.shippingcharges + state.tax - state.discount;
        },
        applyDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.ShippingInfo = action.payload;
        },
        resetCart: () => initialState,

    },

})

export const {
    addToCart,
    removeCartItem,
    calculatePrice,
    applyDiscount,
    saveShippingInfo,
    resetCart
} = cartReducer.actions