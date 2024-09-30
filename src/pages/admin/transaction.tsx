import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { Skeleton } from "../../components/Loader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import { CustomError } from "../../types/api-types";
import { userReducerInitialState } from "../../types/reducer-type";

type DataType = {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}


const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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

const Transaction = () => {
  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)
  const { data, isError, error, isLoading } = useAllOrdersQuery(user?._id!);

  if (isError) {
    const err = error as CustomError;

    toast.error(err.data.message)
  }

  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (data) {
      console.log(data.orders)
      setRows(data.orders.map((i) => ({
        user: i.user.name,
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
        action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
      })))
    }
  }, [data])


  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="table-container">{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default Transaction;
