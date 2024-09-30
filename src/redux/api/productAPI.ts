import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, CategoriesResponse, MessageResponse, NewProductRequest, SearchedProductsRequest, SearchedProductsResponse, SingleProductsResponse, deleteProductRequest, updateProductRequest } from "../../types/api-types";

export const productAPI = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`
    },
    ),
    tagTypes: ["products"],
    endpoints: (builder) => ({
        latestproducts: builder.query<AllProductsResponse, string>({
            query: () => "latest",
            providesTags: ["products"]
        }),
        allproducts: builder.query<AllProductsResponse, string>({
            query: (id) => `admin-products?id=${id}`,
            providesTags: ["products"]

        }),
        categories: builder.query<CategoriesResponse, string>({
            query: () => "categories",
            providesTags: ["products"]

        }),
        productDetails: builder.query<SingleProductsResponse, string>({
            query: (id) => `${id}`,
            providesTags: ["products"]

        }),
        searchProducts: builder.query<SearchedProductsResponse, SearchedProductsRequest>({
            query: ({ search, price, category, sort, page }) => {
                let url = `all?search=${search}&page=${page}`;

                if (price) url += `&price=${price}`;
                if (category) url += `&category=${category}`;
                if (sort) url += `&sort=${sort}`;
                return url;
            },
            providesTags: ["products"]

        }),
        newProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({ formData, id }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["products"]
        }),
        updateProduct: builder.mutation<MessageResponse, updateProductRequest>({
            query: ({ formData, userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["products"]
        }),
        deleteProduct: builder.mutation<MessageResponse, deleteProductRequest>({
            query: ({ userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "DELETE",

            }),
            invalidatesTags: ["products"]
        }),
    })
})

export const {
    useLatestproductsQuery,
    useAllproductsQuery,
    useCategoriesQuery,
    useSearchProductsQuery,
    useProductDetailsQuery,
    useNewProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productAPI

// http://localhost:4000/api/v1/product/all&search=sd&page=1&price=100000
// http://localhost:4000/api/v1/product/all?search=sd&page=1&price=100000