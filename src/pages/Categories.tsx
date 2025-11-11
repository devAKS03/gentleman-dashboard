

import { useState } from "react";
import { useAddCategoryMutation, useGetCategoriesQuery } from "@/Redux/features/dashboard/dashboard/categoryApi";
import { useGetServicesQuery } from "@/Redux/features/dashboard/dashboard/servicesApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Trash2 } from "lucide-react";
import { useDeleteCategoryMutation } from "@/Redux/features/dashboard/dashboard/deleteCategory";
import Swal from "sweetalert2";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Categories() {
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery({});
  const { data: categoriesData, isLoading: categoriesLoading,refetch } = useGetCategoriesQuery({});
  const [addCategory, { isLoading: isSubmitting }] = useAddCategoryMutation();
  
  const [deleteCategory] = useDeleteCategoryMutation();

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [serviceId, setServiceId] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIcon(file);
  };


  const [showModal, setShowModal] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !serviceId) {
      alert("Title and Service are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("serviceId", serviceId);
    if (icon) formData.append("icon", icon);

    try {
      await addCategory(formData).unwrap();
      setTitle("");
      setIcon(null);
      setServiceId("");
      alert("Category created successfully!");
    } catch (err) {
      console.error("Create category failed:", err);
      alert("Failed to create category!");
    }
  };

  // Static placeholder data for table before backend loads
  const staticCategories = [
    {
      id: "1",
      title: "Engine Repair",
      service: { title: "Car Repair" },
      icon: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Oil Change",
      service: { title: "Car Repair" },
      icon: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Tire Replacement",
      service: { title: "Car Repair" },
      icon: null,
      createdAt: new Date().toISOString(),
    },
  ];

  const isPageLoading = categoriesLoading || servicesLoading;

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }



  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F9AA43",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(id).unwrap();
        Swal.fire("Deleted!", "Category has been deleted.", "success");

        refetch()
        // Optionally, refetch categories if needed
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error!", "Failed to delete category.", "error");
      }
    }
  };






  return (
    <div className="p-6">
      {/* Form to create category */}
     <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#F9AA43] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all cursor-pointer"
        >
          + Add New Category
        </button>
      </div>

      {/* Modal for Category Form */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold text-gray-800">
              Create a New Category
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Category Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Title
              </label>
              <input
                type="text"
                placeholder="Enter category title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            {/* Service Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Service
              </label>
              <div className="relative">
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="appearance-none w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
                  required
                >
                  <option value="">Choose a Service</option>
                  {servicesData?.data?.services?.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-dashed border-gray-400 p-3 rounded-xl cursor-pointer hover:border-blue-400 transition-all bg-gray-50"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F9AA43] text-white px-4 cursor-pointer font-semibold py-2.5 rounded-lg shadow-md hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center h-11"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Category"
              )}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Categories Table */}
      <div className="shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Icon</th>
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Service</th>
              <th className="p-3 border-b">Created At</th>
              <th className="p-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {(categoriesData?.data || staticCategories).map((category: any) => (
              <tr key={category.id} className="border-b ">
                <td className="p-3">
                  {category.icon ? (
                    <img
                      src={category.icon}
                      alt={category.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">No icon</span>
                  )}
                </td>
                <td className="p-3">{category.title}</td>
                <td className="p-3">{category.service?.title || "-"}</td>
                <td className="p-3">{new Date(category.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <Trash2
                onClick={() => handleDelete(category.id)}
                  className="cursor-pointer" size={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
