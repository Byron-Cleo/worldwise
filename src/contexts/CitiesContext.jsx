import { createContext, useEffect, useState, useContext } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState(false);

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCites(data);
      } catch (err) {
        alert("There was an error loading data...");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (err) {
      alert("There was an error loading data...");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setCites(cities => [...cities, data])
    } catch (err) {
      alert("There was an error loading data...");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, createCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  //this is to check if the context value is being used in the wrong place
  //i.e not a child component of the provider
  if (context === undefined) {
    throw new Error("useCities must be used outside the CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
