

export type MyUser = {
    name: string,
    photo: string,
    email: string,
    role: string,
    gender: string,
    _id: string,
    dob: string

} 

export type Product = {
    name: string,
    photo: {
        url:string,
        public_id:string
    },
    stock: number,
    price: number,
    category: string,
    _id: string,
}

export type ShippingInfo = {
    address: string,
    country: string,
    state: string,
    city: string,
    pincode: number
}

export type CartItem = {
    name: string,
    photo: {
        url:string,
        public_id:string
    },
    quantity: number,
    price: number,
    productId: string,
    stock: number
}



export type OrderItem = {
    name: string,
    photo: {
        url:string,
        public_id:string
    },
    quantity: number,
    price: number,
    productId: string,
    _id: string
}

export type Order = {
    ShippingInfo: ShippingInfo,
    user: {
        name: string,
        _id: string
    },
    subtotal: number,
    total: number,
    shippingcharges: number,
    tax: number,
    status: string;
    discount: number,
    orderItems: OrderItem[],
    _id: string
}

type PercentChange = {
    revenue: number,
    product: number,
    user: number,
    order: number,
}
type Count = {
    totalRevenue: number,
    product: number,
    user: number,
    order: number,
}
type Transaction = {
    _id: string,
    amount: number,
    status: string,
    discount: number,
    quantity: number
}

export type Stats = {
    percentChange: PercentChange,
    count: Count,
    chart: {
        monthlyOrdercount: number[],
        monthlyRevenue: number[]
    },
    categoryCount: Record<string, number>[],
    usersRatio: {
        male: number,
        female: number
    },
    latestTransactions: Transaction[],
}


type OrderFullfillment = {
    procceesing: number;
    shipped: number;
    delievered: number;
}

type RevenueDistribution = {
    netMargin: number;
    marketingCost: number;
    burnt: number;
    productionCost: number;
    discount: number;
}

type UsersAgeGroup = {
    teen: number;
    adult: number;
    old: number;
}

export type PieCharts = {
    orderFullfillment: OrderFullfillment,
    countCategories: Record<string, number>[],
    stockAvailability: {
        inStock: number;
        outOfStock: number;
    },
    revenueDistribution: RevenueDistribution,
    usersAgeGroup: UsersAgeGroup,
    adminUserCount: {
        admins: number;
        customer: number;
    }
}


export type BarCharts = {
    products: number[],
    users: number[],
    orders: number[]
}

export type LineCharts = {
    products: number[],
    users: number[],
    discount: number[],
    revenue: number[]
}

export type Coupontype = {
    code: string,
    amount: number,
    _id: string
}