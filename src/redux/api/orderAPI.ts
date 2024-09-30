import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrderResponse, MessageResponse, NewOrderRequest, SingleOrderResponse, deleteOrderRequest, processOrderRequest } from "../../types/api-types";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`
    }),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
            query: (orderData) => ({
                url: "new",
                method: "POST",
                body: orderData
            }),
            invalidatesTags: ["orders"]

        }),
        myOrder: builder.query<AllOrderResponse, string>({
            query: (id) => `my?id=${id}`,
            providesTags: ["orders"]

        }),
        orderDetails: builder.query<SingleOrderResponse, string>({
            query: (id) => id,
            providesTags: ["orders"]

        }),
        allOrders: builder.query<AllOrderResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["orders"]

        }),
        processOrder: builder.mutation<MessageResponse, processOrderRequest>({
            query: ({ userId, orderId }) => (
                {
                    url: `${orderId}?id=${userId}`,
                    method: "PUT",
                }
            ),
            invalidatesTags: ["orders"]
        }),
        deleteOrder: builder.mutation<MessageResponse, deleteOrderRequest>({
            query: ({ userId, orderId }) => (
                {
                    url: `${orderId}?id=${userId}`,
                    method: "DELETE",
                }
            ),
            invalidatesTags: ["orders"]
        }),

    })
})

export const {
    useNewOrderMutation,
    useDeleteOrderMutation,
    useProcessOrderMutation,
    useMyOrderQuery,
    useAllOrdersQuery,
    useOrderDetailsQuery,
} = orderApi