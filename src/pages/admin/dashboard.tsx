import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Skeleton } from "../../components/Loader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import Table from "../../components/admin/DashboardTable";
import { useStatsQuery } from "../../redux/api/dashboardAPI";
import { userReducerInitialState } from "../../types/reducer-type";
import userImg from "../../assets/images/user.png";


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
const today = new Date();
const month = today.getMonth();
const SixMonths: string[] = [];

for (let i = 0; i < 6; i++) {
  SixMonths.unshift(months[(month - i + 12) % 12]);
}
const Dashboard = () => {
  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)

  const { data, isError, isLoading } = useStatsQuery(user?._id!);

  const stats = data?.stats!;
  if (isError) return <Navigate to={"/"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        {isLoading ? <Skeleton /> : <>
          <div className="bar">
            <BsSearch />
            <input type="text" placeholder="Search for data, users, docs" />
            <FaRegBell />
            <img src={user?.photo || userImg} alt="User" />
          </div>

          <section className="widget-container">
            <WidgetItem
              percent={stats.percentChange.revenue}
              amount={true}
              value={stats.count.totalRevenue}
              heading="Revenue"
              color="rgba(232, 39, 54,0.8)"
            />
            <WidgetItem
              percent={stats.percentChange.user}
              value={stats.count.user}
              color="rgb(252, 165, 3)"
              heading="Users"
            />
            <WidgetItem
              percent={stats.percentChange.order}
              value={stats.count.order}
              color="rgba(164, 39, 232,0.8)"
              heading="Transactions"
            />
            <WidgetItem
              percent={stats.percentChange.product}
              value={stats.count.product}
              color="rgb(76 0 255)"
              heading="Products"
            />
          </section>

          <section className="graph-container">
            <div className="revenue-chart">
              <h2>Revenue(in Lacks) & Transaction</h2>
              <BarChart
                data_1={stats.chart.monthlyRevenue.map((i) => i / 100000)}
                data_2={stats.chart.monthlyOrdercount}
                title_1="Revenue"
                title_2="Transaction"
                bgColor_1="rgba(232, 39, 54,0.8)"
                bgColor_2="rgba(164, 39, 232,0.8)"
                labels={SixMonths}
              />
            </div>

            <div className="dashboard-categories">
              <h2>Inventory</h2>

              <div>
                {stats.categoryCount.map((i) => {
                  const key = Object.keys(i)[0];
                  const value = i[key]
                  return (< CategoryItem
                    key={key}
                    value={value}
                    heading={key}
                    color={`hsl(${value * 2}, 80%, 50%)`}
                  />)
                })}
              </div>
            </div>
          </section>

          <section className="transaction-container">
            <div className="gender-chart">
              <h2>Gender Ratio</h2>
              <DoughnutChart
                labels={["Female", "Male"]}
                data={[stats.usersRatio.female, stats.usersRatio.male]}
                backgroundColor={[
                  "rgb(252, 165, 3)",
                  "rgba(164, 39, 232,0.8)",
                ]}
                cutout={90}
              />
              <p>
                <BiMaleFemale />
              </p>
            </div>
            <Table data={stats.latestTransactions} />
          </section></>}
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{(percent > 10000 ? 9999 : percent)}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent < -10000 ? -9999 : percent}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent > 0 && (percent > 10000 ? 9999 : percent)}
        {percent < 0 && (percent < -10000 ? -9999 : percent)}%

      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;

