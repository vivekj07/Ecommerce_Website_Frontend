import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { Skeleton } from "../../../components/Loader";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../../../types/reducer-type";
import { resAndNavigate } from "../../../utils/features";
import toast from "react-hot-toast";


const Productmanagement = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)
  const { data, isError, isLoading } = useProductDetailsQuery(params.id!);

  const { price, stock, category, name, photo } = data?.product || {
    price: 0,
    category: "",
    stock: 0,
    name: "",
    photo: {
      url:"",
      public_id:""
    },
  };


  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();


  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const [update] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const deleteHandler = async () => {
    const toastId=toast.loading("Deleteting Product...")
    const res = await deleteProduct({ productId: params.id!, userId: user?._id! });
    resAndNavigate(res, navigate, "/admin/product",toastId)
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", String(priceUpdate));
    if (stockUpdate !== undefined) formData.set("stock", String(stockUpdate));
    if (categoryUpdate) formData.set("category", categoryUpdate);
    if (photoFile) formData.set("photo", photoFile);
   
    const toastId=toast.loading("Updating Product...")
    const res = await update({ productId: params.id!, userId: user?._id!, formData });
    resAndNavigate(res, navigate, "/admin/product",toastId)
  };

  useEffect(() => {
    if (data) {

      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
    }
  }, [data]);
  if (isError) return <Navigate to={"/404"} />

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? <Skeleton length={20} /> :
          <><section>
            <strong>{data?.product._id}</strong>
            <img src={`${photo.url}`} alt="Product" />
            <p>{name}</p>
            {stock > 0 ? (
              <span className="green">{stock} Available</span>
            ) : (
              <span className="red"> Not Available</span>
            )}
            <h3>₹{price}</h3>
          </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>

                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article></>}
      </main>
    </div>
  );
};

export default Productmanagement;
