import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

import "./styles/App.scss";
import Loader from "./components/Loader";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux"
import { getUser } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducers/userReducer";
import { userReducerInitialState } from "./types/reducer-type";
import ProtectedRoute from "./components/ProtectedRoute";


const Home = lazy(() => import("./pages/Home"))
const Cart = lazy(() => import("./pages/Cart"))
const Search = lazy(() => import("./pages/Search"))
const Shipping = lazy(() => import("./pages/Shipping"))
const Login = lazy(() => import("./pages/Login"))
const Orders = lazy(() => import("./pages/Orders"))
const NotFound = lazy(() => import("./pages/not-found"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));


// Admin Pages
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const AllCoupons = lazy(() => import("./pages/admin/apps/allCoupons"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);


const App = () => {
  let { user, loading } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)

  const dispatch = useDispatch();

  useEffect(() => {

    onAuthStateChanged(auth, async (firebaseUser) => {
      // this is firebase user
      if (firebaseUser) {
        const data = await getUser(firebaseUser.uid)
        dispatch(userExist(data!.user))
      } else {
        dispatch(userNotExist())

      }
    })
  }, [dispatch])


  return (

    loading ? <Loader /> :
      <>
        <Router>
          <Header user={user} />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/product/:id" element={<ProductDetails />} />

              <Route path="/login" element={
                < ProtectedRoute isAuthenticated={user ? false : true} >
                  <Login />
                </ProtectedRoute>
              } />

              {
                // Login Pages
              }
              <Route element={
                <ProtectedRoute isAuthenticated={user ? true : false} />
              }>
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/pay" element={<Checkout />} />
              </Route>


              { // Admin Routes 
              }

              <Route
                element={
                  <ProtectedRoute
                    isAuthenticated={user ? true : false}
                    adminOnly={true}
                    admin={user?.role === "admin" ? true : false} />
                }
              >
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/product" element={<Products />} />
                <Route path="/admin/customer" element={<Customers />} />
                <Route path="/admin/transaction" element={<Transaction />} />
                {/* Charts */}
                <Route path="/admin/chart/bar" element={<Barcharts />} />
                <Route path="/admin/chart/pie" element={<Piecharts />} />
                <Route path="/admin/chart/line" element={<Linecharts />} />
                {/* Apps */}
                <Route path="/admin/app/coupon" element={<Coupon user={user} />} />
                <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
                <Route path="/admin/app/coupon/all" element={<AllCoupons user={user} />} />
                {/* Management */}
                <Route path="/admin/product/new" element={<NewProduct />} />
                <Route path="/admin/product/:id" element={<ProductManagement />} />
                <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
              </Route>

              <Route path="*" element={<NotFound />} />

            </Routes>
          </Suspense>
          < Toaster position="bottom-center" />
        </Router >
      </>

  )
}

export default App