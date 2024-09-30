import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useCreateCouponMutation } from "../../../redux/api/couponAPI";
import { MyUser } from "../../../types/types";
import { resAndNavigate } from "../../../utils/features";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const allNumbers = "1234567890";
const allSymbols = "!@#$%^&*()_+";

const Coupon = ({ user }: { user: MyUser | null }) => {
  // const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer)

  const navigate = useNavigate()
  const [size, setSize] = useState<number>(8);
  const [prefix, setPrefix] = useState<string>("");
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [coupon, setCoupon] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const [createCoupon] = useCreateCouponMutation();


  const copyText = async (coupon: string) => {
    await window.navigator.clipboard.writeText(coupon);
    setIsCopied(true);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!includeNumbers && !includeCharacters && !includeSymbols)
      return alert("Please Select One At Least");

    let result: string = prefix || "";
    const loopLength: number = size - result.length;

    for (let i = 0; i < loopLength; i++) {
      let entireString: string = "";
      if (includeCharacters) entireString += allLetters;
      if (includeNumbers) entireString += allNumbers;
      if (includeSymbols) entireString += allSymbols;

      const randomNum: number = ~~(Math.random() * entireString.length);
      result += entireString[randomNum];
    }

    setCoupon(result);

    const res = await createCoupon({ code: result, amount, userId: user?._id! });
    resAndNavigate(res, null, "/admin/app/coupon/all");

  };

  useEffect(() => {
    setIsCopied(false);
  }, [coupon]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Coupon</h1>
        <div className="coupon-box">
          <button onClick={() => navigate('/admin/app/coupon/all')}>See All Coupons</button>
        </div>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Text to include"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              maxLength={size}
            />

            <input
              type="number"
              placeholder="Coupon Length"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min={8}
              max={25}
            />

            <fieldset>
              <legend>Include</legend>

              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((prev) => !prev)}
              />
              <span>Numbers</span>

              <input
                type="checkbox"
                checked={includeCharacters}
                onChange={() => setIncludeCharacters((prev) => !prev)}
              />
              <span>Characters</span>

              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((prev) => !prev)}
              />
              <span>Symbols</span>
            </fieldset>

            <input
              type="number"
              placeholder="Enter Discount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <button type="submit">Generate</button>
          </form>

          {coupon && (
            <code>
              {coupon}{" "}
              <span onClick={() => copyText(coupon)}>
                {isCopied ? "Copied" : "Copy"}
              </span>{" "}
            </code>
          )}
        </section>
      </main>
    </div>
  );
};

export default Coupon;
