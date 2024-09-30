import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { userReducerInitialState } from "../../../types/reducer-type";
import { useBarChartQuery } from "../../../redux/api/dashboardAPI";
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
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Barcharts = () => {
  const today = new Date();
  const month = today.getMonth();
  const SixMonths: string[] = [];
  const TwelveMonths: string[] = [];

  for (let i = 0; i < 6; i++) {
    SixMonths.unshift(months[(month - i + 12) % 12]);
  }
  for (let i = 0; i < 12; i++) {
    TwelveMonths.unshift(months[(month - i + 12) % 12]);
  }


  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)

  const { data, isError, isLoading } = useBarChartQuery(user?._id!);

  const charts = data?.charts!;
  if (isError) return <Navigate to={"/admin/dashboard"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        {isLoading ? <Skeleton /> : <>
          <section>
            <BarChart
              data_1={charts.products}
              data_2={charts.users}
              title_1="Products"
              title_2="Users"
              bgColor_1={`rgba(252, 165, 3,0.6)`}
              bgColor_2={`rgba(76, 0 ,255,0.6)
`}
              labels={SixMonths}
            />
            <h2>Top Products & Top Customers</h2>
          </section>

          <section>
            <BarChart
              horizontal={true}
              data_1={charts.orders}
              data_2={[]}
              title_1="Orders"
              title_2=""
              bgColor_1={`rgba(39, 164, 232)`}
              bgColor_2=""
              labels={TwelveMonths}
            />
            <h2>Orders throughout the year</h2>
          </section></>}
      </main>
    </div>
  );
};

export default Barcharts;
