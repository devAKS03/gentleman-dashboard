import LocationCell from "@/components/LocationCell";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useDeleteUserMutation } from "@/Redux/features/dashboard/Utilisateurs/deleteUserApi";
import { useGetServiceListingQuery } from "@/Redux/features/dashboard/Utilisateurs/getServiceListingApi";
import { useMemo, useState } from "react";

import Swal from "sweetalert2";

import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,

  FaFilter,
  FaTrashAlt,
} from "react-icons/fa";
import { useUpdateUserMutation } from "@/Redux/features/dashboard/Utilisateurs/updateUserApi";

export interface ProviderSummary {
  status: string;
  workShopName: string;
  country: string | null;
  name: string;
  role: string;
  email: string;
  serviceCategoryId: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  latitude: string;
  longitude: string;
  specialist: string;
}

const Utilisateurs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, refetch } = useGetServiceListingQuery(currentPage);

  const [deleteuser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    location: "",
    dateRange: "",
  });

  const [locationNames, setLocationNames] = useState<Record<string, string>>({});

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      category: "",
      location: "",
      dateRange: "",
    });
    setCurrentPage(1);
  };

  const getStatusClasses = (status: any) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredServices = useMemo(() => {
    return (
      data?.data?.filter((service: ProviderSummary) => {
        return (
          (filters.status === "" || service.status === filters.status) &&
          (filters.category === "" ||
            service.specialist.includes(filters.category)) &&
          (filters.location === "" ||
            (service.latitude && service.longitude && `${service.latitude}, ${service.longitude}` === filters.location)) &&
          (filters.dateRange === "" ||
            service.createdAt.startsWith(filters.dateRange))
        );
      }) || []
    );
  }, [data, filters]);

  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const currentItems = filteredServices.length;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + currentItems - 1, totalItems);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const uniqueCategories = useMemo(() => {
    const categories =
      (data?.data as ProviderSummary[])?.map((s) => s.specialist) || [];
    return [...new Set(categories)];
  }, [data]);

  const uniqueLocations = useMemo(() => {
    const locations =
      (data?.data as ProviderSummary[])
        ?.filter((s) => s.latitude && s.longitude && s.latitude !== "null" && s.longitude !== "null")
        ?.map((s) => `${s.latitude}, ${s.longitude}`) || [];
    return [...new Set(locations)];
  }, [data]);

  useMemo(() => {
    const fetchLocationNames = async () => {
      const newNames = { ...locationNames };
      let changed = false;

      for (const loc of uniqueLocations) {
        if (!newNames[loc]) {
          try {
            const [lat, lon] = loc.split(", ");
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`;
            const response = await fetch(url);
            if (response.ok) {
              const geoData = await response.json();
              const name = geoData.city || geoData.locality || geoData.principalSubdivision || loc;
              newNames[loc] = name;
              changed = true;
            }
          } catch (error) {
            console.error("Error fetching location name for filter:", error);
          }
        }
      }

      if (changed) {
        setLocationNames(newNames);
      }
    };

    if (uniqueLocations.length > 0) {
      fetchLocationNames();
    }
  }, [uniqueLocations]);

  const uniqueStatuses = useMemo(() => {
    const statuses =
      (data?.data as ProviderSummary[])?.map(
        (s) => s.status || "Approuvé" || "Confirmé"
      ) || [];
    return [...new Set(statuses)];
  }, [data]);

  const handleEdit = async (id: string) => {
  const { value: status } = await Swal.fire({
    title: "Choisir le nouveau statut",
    input: "select",
    inputOptions: {
      active: "Active",
      inactive: "Inactive",
    },
    inputPlaceholder: "Sélectionnez un statut",
    showCancelButton: true,
  });

  if (status) {
    try {
      await updateUser({ id, data: { status } }).unwrap();
      Swal.fire("Mis à jour !", `Statut mis à jour à "${status}".`, "success");
      refetch();
    } catch (error) {
      Swal.fire("Erreur !", "Échec de la mise à jour du statut.", "error");
      console.error("Erreur mise à jour :", error);
    }
  }
};


  // const handleView = (id: any) => console.log("Voir le service :", id);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Voulez-vous supprimer ce service ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
    });

    if (result.isConfirmed) {
      try {
        await deleteuser(id).unwrap();
        Swal.fire("Supprimé !", "Le service a été supprimé.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Erreur !", "Échec de la suppression du service.", "error");
        console.error("Erreur suppression :", error);
      }
    }
  };

  // const handleAddNewService = () => console.log("Ajouter un nouveau service cliqué");

  if (!data) {
    return <div><LoadingSpinner /></div>;
  }

  return (
    <div className="min-h-screen  p-4 font-sans sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Liste des services</h1>
        {/* <button
          className="bg-[#F9AA43] flex gap-2 cursor-pointer items-center justify-center p-2 px-4 rounded-xl text-white"
          onClick={handleAddNewService}
        >
          <FaPlus /> Ajouter un service
        </button> */}
      </div>

      {/* Filtres */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex items-center gap-2 text-gray-600">
          <FaFilter className="size-4" />
          <span className="font-medium">Filtres :</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Statut</option>
            {uniqueStatuses.map((status) => (
              <option key={String(status)} value={String(status)}>
                {String(status)}
              </option>
            ))}
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Catégorie</option>
            {uniqueCategories.map((category) => (
              <option key={String(category)} value={String(category)}>
                {String(category)}
              </option>
            ))}
          </select>

          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Toutes les localisations</option>
            {uniqueLocations.map((location) => (
              <option key={String(location)} value={String(location)}>
                {locationNames[location] || location}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />

          <button onClick={handleClearFilters} className="w-full justify-center lg:col-span-1">
            <span className="text-yellow-600 cursor-pointer">Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du service</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredServices?.length > 0 ? (
              filteredServices.map((service: ProviderSummary) => (
                <tr key={service.id}>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">{service.workShopName}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">{service.name}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">{service.specialist}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                    <LocationCell latitude={service.latitude} longitude={service.longitude} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClasses(service.status)}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                    {new Date(service.createdAt).toISOString().slice(0, 10)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(service.id)} title="Modifier">
                        <FaEdit className="size-4 text-blue-500" />
                      </button>
                      {/* <button onClick={() => handleView(service.id)} title="Voir">
                        <FaEye className="size-4 text-gray-500" />
                      </button> */}
                      <button onClick={() => handleDelete(service.id)} title="Supprimer">
                        <FaTrashAlt className="size-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Aucun service trouvé avec les critères actuels.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Afficher</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border border-gray-300 bg-white py-1 pl-2 pr-8 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {[5, 10, 20, 50].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">entrées</span>
        </div>

        <div className="text-sm text-gray-700">
          Affichage de {startItem} à {endItem} sur {totalItems} entrées
        </div>

        <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-l-md px-2 py-1 border cursor-pointer border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FaChevronLeft className="size-3" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`relative z-10 px-2 py-1 border cursor-pointer text-sm ${
                currentPage === page
                  ? "bg-[#F9AA43] text-white border-[#F9AA43]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-r-md px-2 py-1 border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            <FaChevronRight className="size-3" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Utilisateurs;
