import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducers/cartReducer";
import { NewOrderRequest } from "../types/api-types";
import { cartReducerInitialState, userReducerInitialState } from "../types/reducer-type";
import { resAndNavigate } from "../utils/features";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
  const elements = useElements();
  const stripe = useStripe();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingcharges, total, subtotal, tax, cartItems, discount, ShippingInfo }
    = useSelector((state: { cartReducer: cartReducerInitialState }) => state.cartReducer)

  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [newOrder] = useNewOrderMutation()

  const cashPay = () => {
    toast.error("This Option is not Available Yet!")
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderData: NewOrderRequest = {
      shippingcharges, total, subtotal, tax,
      orderItems: cartItems, discount, user: user?._id!, ShippingInfo
    };

    if (!elements || !stripe) return;

    setIsProcessing(true);



    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: ``,
      },
      redirect: "if_required"

    })

    if (error) {
      setIsProcessing(false)
      return toast.error(error.message || "Payment Failed");
    } else {
      const res = await newOrder(orderData);
      resAndNavigate(res, navigate, "/orders");
      dispatch(resetCart());
    }

    setIsProcessing(false)
  }
  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>

      <button onClick={cashPay}>Cash On Delievery</button>
    </div>
  );
};



const Checkout = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;
  if (!clientSecret) {
    toast.error("Payment cannot initialize")
    return < Navigate to="/shipping" />
  }

  const options = {
    clientSecret,
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />

    </Elements>
  )
}

export default Checkout