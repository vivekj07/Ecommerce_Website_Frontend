import { useState } from "react";
import { BiLogIn } from "react-icons/bi";
import { FaCartPlus, FaHome, FaSearch, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { MyUser } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

const Header = ({ user }: { user: MyUser | null }) => {

    const [isOpen, setisOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Signed out")
            setisOpen(false);
        } catch (err) {
            toast.error("Sign out failed")
        }

    }

    return (
        <>
            <nav className="header">
                <Link to="/" onClick={() => setisOpen(false)}>
                    <FaHome></FaHome>
                </Link>
                <Link to="/search" onClick={() => setisOpen(false)}>
                    <FaSearch></FaSearch>
                </Link>
                <Link to="/cart" onClick={() => setisOpen(false)}>
                    <FaCartPlus />
                </Link>


                {
                    user?._id ? (
                        <>
                            <button onClick={() => setisOpen((pre) => !pre)}>
                                <FaUser />
                            </button>

                            <dialog open={isOpen}>
                                <div >
                                    {
                                        user.role === "admin" && (
                                            <Link to="/admin/dashboard" onClick={() => setisOpen(false)} >Admin </Link>
                                        )
                                    }

                                    <Link to="/orders" onClick={() => setisOpen(false)}> Orders</Link>
                                    <button onClick={logoutHandler}>
                                        <FaSignOutAlt />
                                    </button>
                                </div>
                            </dialog>
                        </>
                    ) : (<>
                        <Link to="/login">
                            <BiLogIn />
                        </Link>
                    </>)
                }
            </nav >
        </>
    )
}

export default Header