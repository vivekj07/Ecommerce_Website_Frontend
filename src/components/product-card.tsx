import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";
import { useNavigate } from "react-router-dom";

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
    const navigate=useNavigate()

    const navigateTo=(productID:string)=>{
        navigate(`/product/${productID}`)
    }
    
    return (
        <div className="product-card" onClick={()=>navigateTo(productID)}>
            <img src={`${photo.url}`} alt={name}></img>
            <p>{name}</p>
            <span>₹{price}</span>

            <div>
            <button onClick={(e) => {
                    e.stopPropagation(); // Prevents event from bubbling to the outer div
                    handler({
                        name,
                        photo,
                        quantity: 1,
                        price,
                        productId: productID,
                        stock
                    });
                }}>
                    <FaPlus />
                </button>
            </div>

        </div>
    )
}

export default ProductCard