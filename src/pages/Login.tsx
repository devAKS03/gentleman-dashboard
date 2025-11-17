// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useLoginMutation } from "@/Redux/features/auth/loginApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/Redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/Redux/features/auth/authSlice";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [login] = useLoginMutation();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);

  // 🔹 Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result: any = await login({ email, password }).unwrap();
      if (result?.success) {
        dispatch(
          setUser({
            user: result.data.user,
            token: result.data.accessToken,
          })
        );
        toast.success(result.message);
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.data?.message || "Login failed");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-white ">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded space-y-4 w-[400px] py-12 shadow-2xl"
      >
        <h2 className="text-xl text-[#F9AA43] font-bold text-center">Se connecter</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
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

        {/* Login button */}
        <button
          type="submit"
          className="w-full bg-[#F9AA43]  py-2 rounded cursor-pointer"
        >
          Se connecter
        </button>
        
      </form>
    </div>
  );
};

export default Login;
