import { useEffect, useState } from 'react';
import { BiError } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItemCard from "../components/cart-item";
import { cartReducerInitialState } from '../types/reducer-type';
import { addToCart, applyDiscount, calculatePrice, removeCartItem } from '../redux/reducers/cartReducer';
import { CartItem } from '../types/types';
import axios from 'axios';
import { server } from '../redux/store';
import { RxCross1 } from 'react-icons/rx';
const Cart = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const dispatch = useDispatch();
    const { subtotal,
        total,
        shippingcharges,
        tax,
        discount,
        cartItems
    } = useSelector((state: { cartReducer: cartReducerInitialState }) => state.cartReducer)


    const [couponCode, setCouponCode] = useState<string>("");
    const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(true);

    const incrementHandler = (cartItem: CartItem) => {
        if (cartItem.stock <= cartItem.quantity) return;
        dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
    }
    const decrementHandler = (cartItem: CartItem) => {
        if (cartItem.quantity <= 1) return;
        dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
    }

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const removeHandler = (productId: string) => {
        dispatch(removeCartItem(productId));

    }

    useEffect(() => {
        const { token, cancel } = axios.CancelToken.source()
        const timeId = setTimeout(() => {

            axios.get
                (`${server}/api/v1/payment/discount?code=${couponCode}`, { cancelToken: token })
                .then((res) => {
                    dispatch(applyDiscount(res.data.discount));
                    dispatch(calculatePrice());

                    setIsValidCouponCode(true)
                }).catch(() => {
                    dispatch(applyDiscount(0));
                    dispatch(calculatePrice());

                    setIsValidCouponCode(false)

                })
        }, 1000)

        return () => {
            clearTimeout(timeId);
            cancel();
            setIsValidCouponCode(false)
        }
    }, [couponCode]);

    useEffect(() => {
        dispatch(calculatePrice());
    }, [cartItems]);

    return (
        <div className='cart'>
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                {isSidebarOpen ? <RxCross1 /> : "Check"}
            </button>
            <main>
                {cartItems.length > 0 ? (
                    cartItems.map((i, idx) => (
                        <CartItemCard
                            key={idx}
                            cartItem={i}
                            incrementHandler={incrementHandler}
                            decrementHandler={decrementHandler}
                            removeHandler={removeHandler}

                        />
                    ))
                ) : (
                    <h1>No Items Added</h1>
                )}
            </main>
            <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
                <p className='green' style={{ wordSpacing: 2, letterSpacing: 1 }}>Products : <span>{cartItems.length}</span> </p>
                <p>Subtotal: ₹{subtotal}</p>
                <p>Shipping Charges: ₹{shippingcharges}</p>
                <p>Tax: ₹{tax}</p>
                <p>
                    Discount: <em className="red"> - ₹{discount}</em>
                </p>
                <p>
                    <b>Total: ₹{total}</b>
                </p>

                <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                />


                {couponCode &&
                    (isValidCouponCode ? (
                        <span className="green">
                            ₹{discount} off using the <code>{couponCode}</code>
                        </span>
                    ) : (
                        <span className="red">
                            Invalid Coupon <BiError />
                        </span>
                    ))}

                {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
            </aside>

        </div>
    )
}

export default Cart