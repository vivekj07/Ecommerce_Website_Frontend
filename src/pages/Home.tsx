import { Link } from 'react-router-dom';
import ProductCard from '../components/product-card';
import { useLatestproductsQuery } from '../redux/api/productAPI';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/Loader';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/reducers/cartReducer';
import { CartItem } from '../types/types';


const Home = () => {
    const dispatch = useDispatch();
    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock")
        dispatch(addToCart(cartItem));
        toast.success("Item added to cart")
    };

    const { data, isError, isLoading } = useLatestproductsQuery("");
    if (isError) toast.error("Cannot fetch Products")
    return (
        <div className="home">
            <section></section>

            <h1>
                Latest Products
                <Link to="/search" className="findmore">
                    More
                </Link>
            </h1>

            <main>
                {isLoading ? <Skeleton /> :
                    data?.products.map((i) => {
                        return <ProductCard key={i._id} name={i.name} productID={i._id} photo={i.photo.url} stock={i.stock} price={i.price}
                            handler={addToCartHandler} />
                    })}


            </main>
        </div>
    )
}

export default Home