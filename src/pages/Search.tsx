import { useState } from "react";
import ProductCard from "../components/product-card";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { Skeleton } from "../components/Loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducers/cartReducer";

const search = () => {

    const dispatch = useDispatch();

    const { data: CategoryData, isError: isCategoryError, error: CategoryError }
        = useCategoriesQuery("");

    if (isCategoryError) {
        const err = CategoryError as CustomError
        toast.error(err.data.message)
    }


    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [maxPrice, setMaxPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);


    const { data: SearchedData,
        isError: isSearchedError,
        isLoading: SearchedLoading,
        error: SearchedError
    }
        = useSearchProductsQuery({ search, sort, price: maxPrice, category, page });

    const isPrevPage = page > 1;
    const isNextPage = page < SearchedData?.totalpages!;

    if (isSearchedError) {
        const err = SearchedError as CustomError
        toast.error(err.data.message)
    }



    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock")
        dispatch(addToCart(cartItem));
        toast.success("Item added to cart")
    };
    return (
        <div className="product-search-page">
            <aside>
                <h2>Filters</h2>
                <div>
                    <h4>Sort</h4>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">None</option>
                        <option value="asc">Price (Low to High)</option>
                        <option value="dsc">Price (High to Low)</option>
                    </select>
                </div>

                <div>
                    <h4>Max Price: {maxPrice || ""}</h4>
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                </div>

                <div>
                    <h4>Category</h4>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">ALL</option>
                        {
                            CategoryData?.categories.map((i) => (
                                <option key={i} value={i}>{i.toUpperCase()}</option>
                            ))
                        }


                    </select>
                </div>
            </aside>
            <main>
                <h1>Products</h1>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="search-product-list">
                    {
                        SearchedLoading ? <Skeleton length={10} /> :
                            SearchedData?.products.map((i) => (
                                <ProductCard key={i._id} name={i.name} productID={i._id} photo={i.photo} stock={i.stock} price={i.price}
                                    handler={addToCartHandler} />
                            ))
                    }
                </div>
                {
                    SearchedData && SearchedData.totalpages > 1 ?
                        <article>
                            <button
                                disabled={!isPrevPage}
                                onClick={() => setPage((prev) => prev - 1)}
                            >
                                Prev
                            </button>
                            <span>
                                {page} of {SearchedData.totalpages}
                            </span>
                            <button
                                disabled={!isNextPage}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </button>
                        </article> : <></>
                }


            </main>
        </div>
    )
}

export default search