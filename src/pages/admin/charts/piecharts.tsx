import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Skeleton } from "../../../components/Loader";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { usePieChartQuery } from "../../../redux/api/dashboardAPI";
import { userReducerInitialState } from "../../../types/reducer-type";

const PieCharts = () => {
  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)

  const { data, isError, isLoading } = usePieChartQuery(user?._id!);

  const charts = data?.charts!;
  if (isError) return <Navigate to={"/admin/dashboard"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? <Skeleton /> : <>
          <h1>Pie & Doughnut Charts</h1>
          <section>
            <div>
              <PieChart
                labels={["Processing", "Shipped", "Delivered"]}
                data={[charts.orderFullfillment.procceesing, charts.orderFullfillment.shipped, charts.orderFullfillment.delievered]}
                backgroundColor={[
                  `hsl(${110 * Math.random()},80%, 80%)`,
                  `hsl(${110 * Math.random()},80%, 50%)`,
                  `hsl(${110 * Math.random()},40%, 50%)`,
                ]}
                offset={[15, 15, 15]}
              />
            </div>
            <h2>Order Fulfillment Ratio</h2>
          </section>

          <section>
            <div>
              <DoughnutChart
                labels={charts.countCategories.map((i) => Object.keys(i)[0])}
                data={charts.countCategories.map((i) => i[Object.keys(i)[0]])}
                backgroundColor={charts.countCategories.map(
                  (i) => `hsl(${i[Object.keys(i)[0]]},80%,40%)`
                )}
                legends={false}
                offset={[10]}
              />
            </div>
            <h2>Product Categories Ratio</h2>
          </section>

          <section>
            <div>
              <DoughnutChart
                labels={["In Stock", "Out Of Stock"]}
                data={[charts.stockAvailability.inStock, charts.stockAvailability.outOfStock]}
                backgroundColor={["rgb(53, 162, 255)", "hsl(110,80%,40%)"]}
                legends={false}
                offset={[0, 10]}
                cutout={"70%"}
              />
            </div>
            <h2> Stock Availability</h2>
          </section>

          <section>
            <div>
              <DoughnutChart
                labels={[
                  "Marketing Cost",
                  "Discount",
                  "Burnt",
                  "Production Cost",
                  "Net Margin",
                ]}
                data={[charts.revenueDistribution.marketingCost,
                charts.revenueDistribution.discount,
                charts.revenueDistribution.burnt,
                charts.revenueDistribution.productionCost,
                charts.revenueDistribution.netMargin]}
                backgroundColor={[
                  "hsl(110,80%,40%)",
                  "hsl(19,80%,40%)",
                  "hsl(69,80%,40%)",
                  "hsl(300,80%,40%)",
                  "rgb(53, 162, 255)",
                ]}
                legends={false}
                offset={[10, 10, 20, 10, 10]}
              />
            </div>
            <h2>Revenue Distribution</h2>
          </section>

          <section>
            <div>
              <PieChart
                labels={[
                  "Teenager(Below 20)",
                  "Adult (20-40)",
                  "Older (above 40)",
                ]}
                data={[charts.usersAgeGroup.teen,
                charts.usersAgeGroup.adult,
                charts.usersAgeGroup.old]}
                backgroundColor={[
                  `hsl(10, ${80}%, 80%)`,
                  `hsl(10, ${80}%, 50%)`,
                  `hsl(10, ${40}%, 50%)`,
                ]}
                offset={[0, 10, 10]}
              />
            </div>
            <h2>Users Age Group</h2>
          </section>

          <section>
            <div>
              <DoughnutChart
                labels={["Admin", "Customers"]}
                data={[charts.adminUserCount.admins, charts.adminUserCount.customer]}
                backgroundColor={[`#101820`, "#F9E795"]}
                offset={[0, 10]}
                cutout={90}
              />
            </div>
            <h2>Admin and Customers</h2>
          </section></>}
      </main>
    </div>
  );
};

export default PieCharts;
