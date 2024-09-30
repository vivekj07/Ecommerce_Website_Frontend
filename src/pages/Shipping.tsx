import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartReducerInitialState } from "../types/reducer-type";
import { saveShippingInfo } from "../redux/reducers/cartReducer";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";

const Shipping = () => {

    const { cartItems, total } =
        useSelector((state: { cartReducer: cartReducerInitialState }) => state.cartReducer)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [shippingInfo, setshippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: 0,
    });



    const ChangeHandeler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setshippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(saveShippingInfo(shippingInfo))
        try {

            const { data } = await axios.post(`${server}/api/v1/payment/create`,
                {
                    "amount": total,
                }
            )
            navigate("/pay", { state: data.clientsecret })

        }
        catch (error) {
            //console.log(error);
            toast.error("Something went wrong")
        }

    }

    useEffect(() => {
        if (cartItems.length <= 0) return navigate("/cart");
    }, [cartItems])


    return (
        <div className="shipping">
            <button onClick={() => {
                navigate("/cart")
            }}>
                <BiArrowBack />
            </button>
            <form onSubmit={submitHandler}>
                <h1>SHIPPING ADDRESS</h1>
                <input type="text" name="address" placeholder="Address" value={shippingInfo.address} required
                    onChange={ChangeHandeler}></input>
                <input type="text" name="city" placeholder="City" value={shippingInfo.city} required
                    onChange={ChangeHandeler}></input>
                <input type="text" name="state" placeholder="State" value={shippingInfo.state} required
                    onChange={ChangeHandeler}></input>
                <select name="country"
                    required
                    value={shippingInfo.country}
                    onChange={ChangeHandeler}>
                    <option value="">Choose Country</option>
                    <option value="india">India</option>
                    <option value="usa">USA</option>
                </select>
                <input type="text" name="pincode" placeholder="PinCode" value={shippingInfo.pincode} required
                    onChange={ChangeHandeler}></input>
                <button >PAY NOW</button>
            </form>
        </div>
    )
}

export default Shipping