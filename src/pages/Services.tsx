

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
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useDeleteServiceMutation } from "@/Redux/features/dashboard/dashboard/deleteService";
import { toast } from "react-toastify";

export default function ServicesPage() {
  const { data, isLoading: servicesLoading,refetch } = useGetServicesQuery({});
  const [addService, { isLoading: isSubmitting }] = useAddServiceMutation();
    const [deleteService] = useDeleteServiceMutation();

    console.log("Services data:", data);


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
      toast.success("Service créé avec succès !");
    } catch (err) {
      console.error("Failed to create service:", err);
     toast.error("Échec de la création du service !");
    }
  };




 const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "Cette action ne peut pas être annulée !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F9AA43",
    cancelButtonColor: "#d33",
    confirmButtonText: "Oui, supprimez-le !",
  });

  if (result.isConfirmed) {
    try {
      await deleteService(id).unwrap();
      Swal.fire("Supprimé !", "Le service a été supprimé.", "success");
      refetch(); // ✅ Récupération des données après suppression du service
    } catch (err) {
      console.error("Échec de la suppression :", err);
      Swal.fire("Erreur !", "La suppression du service a échoué.", "error");
    }
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
            <button className="px-4 py-2 bg-[#F9AA43] text-white rounded-lg cursor-pointer">
             + Créer un service
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                 Titre
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entrez le titre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Icône de téléchargement
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
              <th className="p-3 border-b">Icône</th>
              <th className="p-3 border-b">Titre</th>
              <th className="p-3 border-b">Nombre de catégories</th>
              <th className="p-3 border-b">Créé à</th>
              <th className="p-3 border-b">Action</th>

            </tr>
          </thead>
          <tbody>
            {(data?.data || staticServices).map((service: any) => (
              
              <tr key={service.id} className="border-b ">
                <td className="p-3">
                  {service.icon ? (
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="w-12 h-12 object-cover rounded-md border"
                    />
                  ) : (
                    <span className="text-gray-400">No icon</span>
                  )}
                </td>
                <td className="p-3">{service.title}</td>
                <td className="p-3">{service.categoryCount}</td>
                <td className="p-3">{new Date(service.createdAt).toLocaleDateString()}</td>
                <td className="p-3"> <Trash2
                  
                  onClick={() => handleDelete(service.id)}
                  
                  className="cursor-pointer" size={20} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
