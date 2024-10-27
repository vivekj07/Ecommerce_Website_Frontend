import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import { useOrderDetailsQuery } from "../redux/api/orderAPI";
import { Order, OrderItem } from "../types/types";



const OrderDetails = () => {

  const params = useParams();
  const { data, isError, isLoading } = useOrderDetailsQuery(params.id!);
  const [order, setOrder] = useState<Order>({
    user: {
      name: "string",
      _id: "string",
    },
    ShippingInfo: {
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: 8787,
    },

    subtotal: 0,
    total: 0,
    shippingcharges: 0,
    tax: 0,
    status: 'string',
    discount: 0,
    orderItems: [],
    _id: "",
  });



  useEffect(() => {
    if (data) {
      setOrder(data.order);
    }
  })

  if (isError) return <Navigate to={"/404"} />

  return (
    <div className="order-container">
      <main className="product-management">
        {isLoading ? <Skeleton length={20} /> : <>
          <section
            style={{
              padding: "2rem",
            }}
          >
            <h2>Order Items</h2>

            {order.orderItems.map((i) => (
              <ProductCard
                key={i._id}
                name={i.name}
                photo={i.photo} 
                productId={i.productId}
                _id={i._id}
                quantity={i.quantity}
                price={i.price}
              />
            ))}
          </section>

          <article className="shipping-info-card">
            
            <h1>Order Info</h1>
            <h5>User Info</h5>
            <p>Name: {order.user.name}</p>
            <p>
              Address : {`${order.ShippingInfo.address}, 
            ${order.ShippingInfo.city}, ${order.ShippingInfo.state} ,
             ${order.ShippingInfo.country} ${order.ShippingInfo.pincode}`}
            </p>
            <h5>Amount Info</h5>
            <p>Subtotal: {order.subtotal}</p>
            <p>Shipping Charges: {order.shippingcharges}</p>
            <p>Tax: {order.tax}</p>
            <p>Discount: {order.discount}</p>
            <p>Total: {order.total}</p>

            <h5>Status Info</h5>
            <p>
              Status : {"   "}
              <span
                className={
                  order.status === "Delivered"
                    ? "purple"
                    : order.status === "Shipped"
                      ? "green"
                      : "red"
                }
              >
                {order.status}
              </span>
            </p>
            
          </article></>}
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo.url} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default OrderDetails;
