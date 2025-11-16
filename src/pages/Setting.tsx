
import { useChangePasswordMutation } from "@/Redux/features/dashboard/dashboard/changePassword";
import { useState } from "react";
import { toast } from "react-toastify";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export default function Setting() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await changePassword({
      oldPassword,
      password: newPassword,
    }).unwrap();

    toast.success(res.message || "Password updated successfully!");

    setOldPassword("");
    setNewPassword("");
  } catch (err) {
    // Type narrowing
    if ((err as FetchBaseQueryError).status) {
      const error = err as FetchBaseQueryError;
      toast.error(
        // @ts-ignore
        (error?.data as { message?: string })?.message || "Something went wrong!"
      );
    } else {
      const error = err as SerializedError;
      toast.error(error.message || "Something went wrong!");
    }
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Changer le mot de passe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Old Password */}
          <div>
            <label className="block mb-1 font-medium">Ancien mot de passe
</label>
            <div className="relative">
              <input
                type={showOldPass ? "text" : "password"}
                placeholder="Entrez l'ancien mot de passe"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 pr-10 border rounded-md focus:ring-2 outline-none"
                required
              />

              <span
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showOldPass ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="Entrez le nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 pr-10 border rounded-md focus:ring-2 outline-none"
                required
              />

              <span
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showNewPass ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#F9AA43] text-white py-2 rounded-md cursor-pointer transition"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
