import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useProductDetailsQuery } from "../redux/api/productAPI";
import { MessageResponse } from "../types/api-types";

const ProductDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError,error } = useProductDetailsQuery(id!); 

  if (isError) {
    const err=error as FetchBaseQueryError
    const e=err.data as MessageResponse
    console.log(e.message)
    toast.error(e.message)
  } 

  const { price, stock, name, photo } = data?.product || {
    price: 0,
    category: "",
    stock: 0,
    name: "",
    photo: {
      url:"",
      public_id:""
    },
  };

  return (
    <div className="product-details">
      <main className="product-details-container">
      {isLoading ? <Loader />: (
        <section className="product-details">
          {/* <strong>{data?.product._id}</strong> */}
          <img src={`${photo?.url}`} alt={name || "Product"} />
          <p>{name}</p>
          {stock > 0 ? (
            <span className="green">{stock} Available</span>
          ) : (
            <span className="red"> Not Available</span>
          )}
          <h4>₹{price}</h4>
        </section>
      )}
    </main>
    </div>
  );
};

export default ProductDetails;
