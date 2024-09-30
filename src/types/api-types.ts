import { BarCharts, CartItem, Coupontype, LineCharts, Order, PieCharts, Product, ShippingInfo, Stats, MyUser } from "./types"

export type CustomError = {
    status: number,
    data: {
        success: boolean,
        message: string
    }
}

export type MessageResponse = {
    success: boolean,
    message: string,
}

export type getUserResponse = {
    success: boolean,
    user: MyUser,
}
export type AllUsersrResponse = {
    success: boolean,
    users: MyUser[],
}
export type SingleUserResponse = {
    success: boolean,
    user: MyUser,
}
export type AllProductsResponse = {
    success: boolean,
    products: Product[],
}
export type SingleProductsResponse = {
    success: boolean,
    product: Product,
}

export type CategoriesResponse = {
    success: boolean,
    categories: string[],

}
export type SearchedProductsResponse = {
    success: boolean,
    products: Product[],
    totalpages: number;

}
export type AllOrderResponse = {
    success: boolean,
    orders: Order[],
}
export type SingleOrderResponse = {
    success: boolean,
    order: Order,
}

export type StatsResponse = {
    success: boolean,
    stats: Stats
}

export type PieResponse = {
    success: boolean,
    charts: PieCharts
}

export type BarResponse = {
    success: boolean,
    charts: BarCharts
}

export type LineResponse = {
    success: boolean,
    charts: LineCharts
}

export type AllCouponsResponce = {
    success: true,
    coupons: Coupontype[]
}

export type DeleteUserRequest = {
    userId: string,
    adminId: string
}

export type SearchedProductsRequest = {
    search: string,
    price: number,
    category: string,
    sort: string,
    page: number

}

export type NewProductRequest = {
    id: string,
    formData: FormData

}
export type updateProductRequest = {
    userId: string,
    productId: string,
    formData: FormData

}

export type deleteProductRequest = {
    userId: string,
    productId: string,

}

export type NewOrderRequest = {
    ShippingInfo: ShippingInfo,
    user: string,
    subtotal: number,
    total: number,
    shippingcharges: number,
    tax: number,
    discount: number,
    orderItems: CartItem[]
}
export type processOrderRequest = {
    userId: string,
    orderId: string,

}
export type deleteOrderRequest = {
    userId: string,
    orderId: string,

}

export type CouponRequest = {
    code: string,
    amount: number,
    userId: string
}

export type DeleteCouponRequest = {
    couponId: string,
    userId: string
}

