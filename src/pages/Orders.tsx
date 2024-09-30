import { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { useMyOrderQuery } from "../redux/api/orderAPI";
import { userReducerInitialState } from "../types/reducer-type";
import { Link } from "react-router-dom";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";

type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
};

const column: Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];


const Orders = () => {
    const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)
    const { data, isError, error, isLoading } = useMyOrderQuery(user?._id!);

    const [rows, setRows] = useState<DataType[]>([]);

    useEffect(() => {
        if (data) {
            setRows(data.orders.map((i) => ({
                _id: i._id,
                amount: i.total,
                quantity: i.orderItems.length,
                discount: i.discount,
                status: <span
                    className={
                        i.status === "Proccessing"
                            ? "red"
                            : i.status === "Shipped"
                                ? "green"
                                : "purple"
                    }
                >
                    {i.status}
                </span>,
                action: <Link to={`/${i._id}`} >view</Link>,
            })))
        }
    }, [data])

    const Table = TableHOC<DataType>(
        column,
        rows,
        "dashboard-product-box",
        "Orders",
        rows.length > 6
    )();

    if (isError) {
        const err = error as CustomError;

        toast.error(err.data.message)
    }
    return (
        <div className="container">
            <h1>My Orders</h1>
            {isLoading ? <Skeleton length={29} /> : Table}
        </div>
    )
}

export default Orders