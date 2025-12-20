import { useEffect, useState } from "react";

interface Props {
  latitude: string;
  longitude: string;
}

const LocationCell = ({ latitude, longitude }: Props) => {
  const [location, setLocation] = useState("Loading...");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
        console.log(import.meta.env.VITE_OPENCAGE_API_KEY,"fdfsdff");

        if (!API_KEY) {
          setLocation("API key missing");
          return;
        }

        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
          setLocation("Failed to fetch");
          return;
        }

        const data = await response.json();
        const components = data.results?.[0]?.components;

        if (components) {
          const state = components.state || components.region || components.county || "Unknown state";
          const country = components.country || "Unknown country";
          setLocation(`${state}, ${country}`);
        } else {
          setLocation("Unknown");
        }
      } catch (error) {
        setLocation("Error");
        console.error(error);
      }
    };

    if (latitude && longitude) {
      fetchLocation();
    }
  }, [latitude, longitude]);

  return <span>{location}</span>;
};

export default LocationCell;
