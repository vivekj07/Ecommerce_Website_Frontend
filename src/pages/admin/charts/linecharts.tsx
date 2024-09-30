import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { userReducerInitialState } from "../../../types/reducer-type";
import { useLineChartQuery } from "../../../redux/api/dashboardAPI";
import { Navigate } from "react-router-dom";
import { Skeleton } from "../../../components/Loader";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const Linecharts = () => {

  const today = new Date();
  const month = today.getMonth();
  const TwelveMonths: string[] = [];


  for (let i = 0; i < 12; i++) {
    TwelveMonths.unshift(months[(month - i + 12) % 12]);
  }

  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)

  const { data, isError, isLoading } = useLineChartQuery(user?._id!);

  const charts = data?.charts!;
  if (isError) return <Navigate to={"/admin/dashboard"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? <Skeleton /> : <>
          <h1>Line Charts</h1>
          <section>
            <LineChart
              data={charts.users}
              label="Users"
              borderColor="rgb(53, 162, 255)"
              labels={TwelveMonths}
              backgroundColor="rgba(53, 162, 255, 0.5)"
            />
            <h2>Active Users</h2>
          </section>

          <section>
            <LineChart
              data={charts.products}
              backgroundColor={"hsla(269,80%,40%,0.4)"}
              borderColor={"hsl(269,80%,40%)"}
              labels={TwelveMonths}
              label="Products"
            />
            <h2>Total Products</h2>
          </section>

          <section>
            <LineChart
              data={charts.revenue}
              backgroundColor={"hsla(129,80%,40%,0.4)"}
              borderColor={"hsl(129,80%,40%)"}
              label="Revenue"
              labels={TwelveMonths}
            />
            <h2>Total Revenue </h2>
          </section>

          <section>
            <LineChart
              data={charts.discount}
              backgroundColor={"hsla(29,80%,40%,0.4)"}
              borderColor={"hsl(29,80%,40%)"}
              label="Discount"
              labels={TwelveMonths}
            />
            <h2>Discount Allotted </h2>
          </section></>}
      </main>
    </div>
  );
};

export default Linecharts;
