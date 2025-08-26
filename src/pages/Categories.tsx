

import { useState } from "react";
import { useAddCategoryMutation, useGetCategoriesQuery } from "@/Redux/features/dashboard/dashboard/categoryApi";
import { useGetServicesQuery } from "@/Redux/features/dashboard/dashboard/servicesApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Categories() {
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery({});
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({});
  const [addCategory, { isLoading: isSubmitting }] = useAddCategoryMutation();

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [serviceId, setServiceId] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIcon(file);
  };

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

  return (
    <div className="p-6">
      {/* Form to create category */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-6">
        <input
          type="text"
          placeholder="Category Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-500 rounded-lg px-3 py-2 w-full"
          required
        />

       <div className="relative w-full">
  <select
    value={serviceId}
    onChange={(e) => setServiceId(e.target.value)}
    className="appearance-none border border-gray-500 rounded-lg px-3 py-2 w-full text-left pr-10  focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="">Select a Service</option>
    {servicesData?.data?.services?.map((service: any) => (
      <option key={service.id} value={service.id}>
        {service.title}
      </option>
    ))}
  </select>

  {/* Dropdown icon */}
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
    <svg
      className="h-5 w-5 text-gray-500"
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


        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#F9AA43] text-white px-4 py-2 rounded cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create Category"}
        </button>
      </form>

      {/* Categories Table */}
      <div className="shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Icon</th>
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Service</th>
              <th className="p-3 border-b">Created At</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
