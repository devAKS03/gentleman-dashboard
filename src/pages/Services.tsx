

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddServiceMutation, useGetServicesQuery } from "@/Redux/features/dashboard/dashboard/servicesApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ServicesPage() {
  const { data, isLoading: servicesLoading } = useGetServicesQuery({});
  const [addService, { isLoading: isSubmitting }] = useAddServiceMutation();

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIcon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !icon) {
      alert("Please enter a title and upload an icon.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("icon", icon);

    try {
      await addService(formData).unwrap();
      setTitle("");
      setIcon(null);
      setPreview(null);
      alert("Service created successfully!");
    } catch (err) {
      console.error("Failed to create service:", err);
      alert("Failed to create service!");
    }
  };

  // Static placeholder data for table
  const staticServices = [
    { id: 1, title: "Service A", categoryCount: 3, createdAt: "2025-08-01", icon: "" },
    { id: 2, title: "Service B", categoryCount: 5, createdAt: "2025-08-05", icon: "" },
    { id: 3, title: "Service C", categoryCount: 2, createdAt: "2025-08-10", icon: "" },
  ];

  const isPageLoading = servicesLoading;

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header + Create Service */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Services</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-[#F9AA43] text-white rounded-lg ">
              + Create Service
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Upload Icon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>

              {preview && (
                <div>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded-lg text-white transition ${
                  isSubmitting ? "bg-gray-400" : "bg-[#F9AA43] cursor-pointer"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Table */}
      <div className="shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Icon</th>
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Category Count</th>
              <th className="p-3 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {(data?.data?.services || staticServices).map((service: any) => (
              <tr key={service.id} className="border-b ">
                <td className="p-3">
                  {service.icon ? (
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">No icon</span>
                  )}
                </td>
                <td className="p-3">{service.title}</td>
                <td className="p-3">{service.categoryCount}</td>
                <td className="p-3">{new Date(service.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
