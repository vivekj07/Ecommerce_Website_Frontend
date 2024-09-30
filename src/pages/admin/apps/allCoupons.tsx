import { RiDeleteBin2Line } from "react-icons/ri"
import AdminSidebar from "../../../components/admin/AdminSidebar"
import { Skeleton } from "../../../components/Loader"
import { useAllCouponsQuery, useDeleteCouponMutation } from "../../../redux/api/couponAPI"
import { MyUser } from "../../../types/types"
import { resAndNavigate } from "../../../utils/features"
import toast from "react-hot-toast"
import { CustomError } from "../../../types/api-types"

const AllCoupons = ({ user }: { user: MyUser | null }) => {
    // const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)
    const { data, isLoading, isError, error } = useAllCouponsQuery(user?._id!)

    const [deleteCoupon] = useDeleteCouponMutation();

    const deleteHandler = async (couponId: string, userId: string) => {
        const res = await deleteCoupon({ couponId, userId });
        resAndNavigate(res, null, "/admin/app/coupon/all")
    }



    if (isError) { toast.error((error as CustomError).data.message) }

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="dashboard-app-container">

                <h1>All Coupons</h1>
                <div className="coupon-container">

                    {
                        isLoading ? <Skeleton length={15} /> : <>
                            {data?.coupons.map((i, ind) => (
                                <CouponCard key={ind} code={i.code} amount={i.amount} handler={() => deleteHandler(i._id, user?._id!)} />
                            ))}
                        </>
                    }

                </div>

            </main>
        </div>
    )
}

const CouponCard = ({ code, amount, handler }: {
    code: string,
    amount: number,
    handler: () => void
}) => (
    <div className="coupon-card">
        <p className="green">Coupon : {code}</p>
        <p className="red">Dicount : {amount}</p>
        <RiDeleteBin2Line onClick={handler} />
    </div>
)

export default AllCoupons