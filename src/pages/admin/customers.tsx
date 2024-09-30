import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/Loader";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userAPI";
import { CustomError } from "../../types/api-types";
import { userReducerInitialState } from "../../types/reducer-type";
import { resAndNavigate } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


const Customers = () => {
  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)

  const { data, isError, error, isLoading } = useAllUsersQuery(user?._id!)
  const [rows, setRows] = useState<DataType[]>([]);

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id: string) => {
    const res = await deleteUser({ userId: id, adminId: user?._id! });
    resAndNavigate(res, null, "")
  }

  useEffect(() => {
    if (data) {
      setRows(data.users.map((i) => ({
        avatar: <img
          style={{
            borderRadius: "50%",
            height: 40,
            width: 40,
          }}
          src={`${i.photo}`}
          alt={i.name}
        />,
        name: i.name,
        email: i.email,
        gender: i.gender,
        role: i.role,
        action: <button onClick={() => deleteHandler(i._id)}>
          <FaTrash />
        </button>
      })))
    }
  }, [data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  if (isError) {
    toast.error((error as CustomError).data.message)
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="table-container">{isLoading ? <Skeleton length={15} /> : Table}</main>
    </div>
  );
};

export default Customers;
