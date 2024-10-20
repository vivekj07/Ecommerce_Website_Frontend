import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";

type ProductsProps = {
    name: string;
    productID: string;
    photo: {
        url:string,
        public_id:string
    };
    stock: number;
    price: number;
    handler: (cartItem: CartItem) => void;

}


const ProductCard = ({ name, productID, photo, stock, price, handler }: ProductsProps) => {
    return (
        <div className="product-card">
            <img src={`${photo.url}`} alt={name}></img>
            <p>{name}</p>
            <span>₹{price}</span>

            <div>
                <button onClick={() => handler({
                    name,
                    photo,
                    quantity: 1,
                    price,
                    productId: productID,
                    stock
                })} >
                    <FaPlus />
                </button>
            </div>

        </div>
    )
}

export default ProductCard