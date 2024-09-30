import { CartItem, ShippingInfo, MyUser } from "./types"

export type userReducerInitialState = {
    user: MyUser | null,
    loading: boolean

}

export type cartReducerInitialState = {
    loading: boolean,
    ShippingInfo: ShippingInfo,
    subtotal: number,
    total: number,
    shippingcharges: number,
    tax: number,
    discount: number,
    cartItems: CartItem[]
}