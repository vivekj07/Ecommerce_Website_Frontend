import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../redux/reducers/userReducer";

const Login = () => {

    const [gender, setGender] = useState("");
    const [date, setDate] = useState("");

    const [login] = useLoginMutation();

    const dispatch = useDispatch();

    const loginHandler = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);

            const myUser = {
                name: user.displayName!,
                email: user.email!,
                dob: date,
                gender,
                role: "user",
                photo: user.photoURL!,
                _id: user.uid
            }
            const res = await login(myUser)

            if ("data" in res) {
                dispatch(userExist(myUser));
                toast.success(res.data.message)
            } else {
                dispatch(userNotExist());
                const err = res.error as FetchBaseQueryError;
                const message = err.data as MessageResponse;
                toast.error(message.message)
            }

        } catch (err) {
            toast.error("Sign in failed")
            console.log(err)
        }
    }



    return (
        <div className="login">
            <main>
                <h1 className="heading">Login</h1>

                <div>
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div>
                    <label>Date of birth</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div>
                    <p>Already Signed In Once</p>
                    <button onClick={loginHandler}>
                        <FcGoogle /> <span>Sign in with Google</span>
                    </button>
                </div>
            </main>
        </div>
    )
}

export default Login