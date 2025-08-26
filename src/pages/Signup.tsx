// src/pages/Signup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/Redux/features/auth/registerApi";

const Signup = () => {
  const [register] = useRegisterMutation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
 try {
     
    const result = await register(formData)
    console.log(result)
    if(result?.data?.success){
      alert(result?.data?.message);
      navigate('/')
    }

 } catch (error) {
  console.log(error)
 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md space-y-4 w-96"
      >
        <h2 className="text-xl font-bold text-center">Sign Up</h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-black">
  Already have an account?{" "}
  <Link to="/" className="text-green-600 hover:underline">
    Login
  </Link>
</p>

      </form>
      
    </div>
  );
};

export default Signup;
