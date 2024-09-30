import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BarResponse, LineResponse, PieResponse, StatsResponse } from "../../types/api-types";

export const dashboardApi = createApi({
    reducerPath: "dashboradApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`
    },
    ),
    endpoints: (builder) => ({
        stats: builder.query<StatsResponse, string>({
            query: (id) => `stats?id=${id}`,
            keepUnusedDataFor: 0
        }),
        pieChart: builder.query<PieResponse, string>({
            query: (id) => `pie?id=${id}`,
            keepUnusedDataFor: 0

        }),
        barChart: builder.query<BarResponse, string>({
            query: (id) => `bar?id=${id}`,
            keepUnusedDataFor: 0

        }),
        lineChart: builder.query<LineResponse, string>({
            query: (id) => `line?id=${id}`,
            keepUnusedDataFor: 0

        }),
    })
})

export const {
    useStatsQuery,
    useBarChartQuery,
    usePieChartQuery,
    useLineChartQuery
} = dashboardApi