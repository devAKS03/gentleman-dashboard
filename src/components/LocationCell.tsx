import { useEffect, useState } from "react";

interface Props {
  latitude: string;
  longitude: string;
}

// Global cache to store geocoding results across component instances
const geocodeCache: Record<string, string> = {};

const LocationCell = ({ latitude, longitude }: Props) => {
  const [location, setLocation] = useState("Chargement...");

  useEffect(() => {
    const fetchLocation = async () => {
      // Round coordinates to improve cache hits
      const lat = parseFloat(latitude).toFixed(4);
      const lon = parseFloat(longitude).toFixed(4);
      const cacheKey = `${lat},${lon}`;

      if (geocodeCache[cacheKey]) {
        setLocation(geocodeCache[cacheKey]);
        return;
      }

      try {
        // Using BigDataCloud's Reverse Geocode Client (Keyless for client-side)
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("API call failed");
        }

        const data = await response.json();
        
        // Construct a readable address: Locality + City/PrincipalSubdivision
        const parts = [];
        if (data.city) parts.push(data.city);
        else if (data.locality) parts.push(data.locality);
        
        if (data.principalSubdivision && data.principalSubdivision !== data.city) {
          parts.push(data.principalSubdivision);
        }
        
        if (data.countryName) parts.push(data.countryName);

        const address = parts.length > 0 ? parts.join(", ") : `${latitude}, ${longitude}`;
        
        geocodeCache[cacheKey] = address;
        setLocation(address);
      } catch (error) {
        console.error("Geocoding error:", error);
        // Silently fallback to coordinates
        const fallback = `${latitude}, ${longitude}`;
        setLocation(fallback);
      }
    };

    if (latitude && longitude && latitude !== "null" && longitude !== "null") {
      fetchLocation();
    } else {
      setLocation("Inconnu");
    }
  }, [latitude, longitude]);

  return <span className="text-sm font-medium text-gray-700">{location}</span>;
};

export default LocationCell;
