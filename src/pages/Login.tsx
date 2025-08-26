// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useLoginMutation } from "@/Redux/features/auth/loginApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/Redux/features/auth/authSlice";

const Login = () => {
  const [login] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password });
      console.log("----------------------------------------------------")
      console.log(result)
      if (result?.data?.success) {
        dispatch(setUser({
          user: result?.data?.data?.user, token: result?.data?.data?.accessToken
        }))
        alert(result?.data?.message);
        navigate('/dashboard')
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded space-y-4 w-[400px] py-12 shadow-2xl"
      >
        <h2 className="text-xl text-primary font-bold text-center">Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/80 py-2 rounded"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-black">
          Already have an account?{" "}
          <Link to="/signup" className="text-green-600 hover:underline">
            signup
          </Link>
        </p>
      </form>


    </div>
  );
};

export default Login;
