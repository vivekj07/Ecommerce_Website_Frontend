import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllCouponsResponce, CouponRequest, DeleteCouponRequest, MessageResponse } from "../../types/api-types";


export const Coupon = createApi({
    reducerPath: "Coupon",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
    }),
    tagTypes: ["Coupon"],
    endpoints: (builder) => ({
        createCoupon: builder.mutation<MessageResponse, CouponRequest>({
            query: ({ userId, code, amount }) => ({
                url: `coupon/new?id=${userId}`,
                method: "POST",
                body: { code, amount }
            }),
            invalidatesTags: ["Coupon"]
        }),


        allCoupons: builder.query<AllCouponsResponce, string>({
            query: (id) => ({
                url: `/coupons?id=${id}`
            }),
            providesTags: ["Coupon"]

        }),
        deleteCoupon: builder.mutation<MessageResponse, DeleteCouponRequest>({
            query: ({ couponId, userId }) => ({
                url: `/coupons/${couponId}?id=${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Coupon"]

        }),

    })
})

export const { useCreateCouponMutation,
    useAllCouponsQuery,
    useDeleteCouponMutation
} = Coupon