// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useLoginMutation } from "@/Redux/features/auth/loginApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/Redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "@/Redux/features/dashboard/dashboard/changePassword";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/Redux/features/auth/authSlice";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [login] = useLoginMutation();
  const [changePassword] = useChangePasswordMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Change password toggle
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Change password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

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

  // Change password handler
 const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await changePassword({
      oldPassword: oldPassword,
      password: newPassword,
    }).unwrap();
    if (res.success) {
      toast.success(res.message);
      setShowChangePassword(false);
      setOldPassword("");
      setNewPassword("");
    }
  } catch (err: any) {
    console.log(err);
    toast.error(err?.data?.message || "Failed to change password");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white">
      <form
        onSubmit={handleLogin}
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

        {/* Login button */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/80 py-2 rounded cursor-pointer"
        >
          Login
        </button>

        {/* Change password toggle */}
        <p
          className="mt-2 text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => setShowChangePassword(!showChangePassword)}
        >
          Change Password?
        </p>

        {/* Change Password Fields */}
        {showChangePassword && (
          <div className="space-y-3 mt-3">
            {/* Old Password */}
            <div className="relative">
              <input
                type={showOldPass ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
              />
              <span
                onClick={() => setShowOldPass((prev) => !prev)}
                className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
              >
                {showOldPass ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
              />
              <span
                onClick={() => setShowNewPass((prev) => !prev)}
                className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
              >
                {showNewPass ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white cursor-pointer"
            >
              Change Password
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
