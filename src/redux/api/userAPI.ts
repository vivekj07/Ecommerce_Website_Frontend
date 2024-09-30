import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllUsersrResponse, DeleteUserRequest, MessageResponse, SingleUserResponse, getUserResponse } from "../../types/api-types";
import { MyUser } from "../../types/types";
import axios from "axios";

export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`
    }),
    tagTypes: ["users"],
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, MyUser>({
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user
            }),
            invalidatesTags: ["users"]
        }),
        allUsers: builder.query<AllUsersrResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["users"]
        }),
        singleUser: builder.query<SingleUserResponse, string>({
            query: (id) => id,
            providesTags: ["users"]

        }),
        deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
            query: ({ userId, adminId }) => ({
                url: `${userId}?id=${adminId}`,
                method: "DELETE",

            }),
            invalidatesTags: ["users"]

        }),
    })
})

export const getUser = async (id: string) => {
    try {
        const { data }: { data: getUserResponse } =
            await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`)
        return data;
    } catch (err) {
        console.log(err)
    }
}


export const { useLoginMutation,
    useDeleteUserMutation,
    useAllUsersQuery,
    useSingleUserQuery
} = userAPI;