import { ChangeEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../../../types/reducer-type";
import { useNavigate } from "react-router-dom";
import { resAndNavigate } from "../../../utils/features";

const NewProduct = () => {
  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)
  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  const submitHnadler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !category || !price || !photo) return toast.error("Please enter all fields");

    if (stock == 0) return toast.error("Stock cannot be 0");

    const formData = new FormData();

    formData.set("name", name);
    formData.set("price", String(price));
    formData.set("stock", String(stock));
    formData.set("category", category);
    formData.set("photo", photo);
    
    const toastId=toast.loading("Creating Product...")
    const res = await newProduct({ id: user?._id!, formData })
    resAndNavigate(res, navigate, "/admin/product",toastId);

  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHnadler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required

                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required

                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required

                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input
                required
                type="file" onChange={changeImageHandler} />
            </div>

            {photoPrev && <img src={photoPrev} alt="New Image" />}
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
