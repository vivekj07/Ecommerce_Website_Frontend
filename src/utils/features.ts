import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";


type ResType = {
    data: MessageResponse;
} | {
    error: FetchBaseQueryError | SerializedError;
}


export const resAndNavigate = (res: ResType, navigate: NavigateFunction | null, url: string) => {
    if ("data" in res) {
        toast.success(res.data.message)
        if (navigate) {
            navigate(url)
        }
    } else {
        const error = res.error as FetchBaseQueryError;
        const err = error.data as MessageResponse
        toast.error(err.message)
    }
}
