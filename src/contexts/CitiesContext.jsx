import {
  createContext,
  useEffect,
  useState,
  useContext,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  //inside here we should put as many logic as possible to have a central place that handles business logic
  //i.e all the state transitions
  //NB: Reducers need to be pure functions. Meaning API requests can not be defined inside reducers.
  //Hence instead, API requests can be done in seperate functions then dispatch actions once the data has been received form the API requests

  //STEP 1: DEFINE THE ACTIONS
  switch (action.type) {
    case "laoded":
      return {
        ...state,
        isLoading: true,
      };

    case "cities/laoded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type.");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if(Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the cities...",
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }
  // const [cities, setCites] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState(false);

  // useEffect(function () {
  //   async function fetchCities() {
  //     try {
  //       setIsLoading(true);
  //       const res = await fetch(`${BASE_URL}/cities`);
  //       const data = await res.json();
  //       setCites(data);
  //     } catch (err) {
  //       alert("There was an error loading data...");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchCities();
  // }, []);

  // async function getCity(id) {
  //   try {
  //     setIsLoading(true);
  //     const res = await fetch(`${BASE_URL}/cities/${id}`);
  //     const data = await res.json();
  //     setCurrentCity(data);
  //   } catch (err) {
  //     alert("There was an error loading data...");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // async function createCity(newCity) {
  //   try {
  //     setIsLoading(true);

  //     //this is line of code updates the server/remote state by making a post request
  //     const res = await fetch(`${BASE_URL}/cities`, {
  //       method: "POST",
  //       body: JSON.stringify(newCity),
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     const data = await res.json();
  //     //this line updates the UI state so that the UI reflects the new created city
  //     setCites((cities) => [...cities, data]);
  //   } catch (err) {
  //     alert("There was an error creating a city.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // async function deleteCity(id) {
  //   try {
  //     setIsLoading(true);

  //     await fetch(`${BASE_URL}/cities/${id}`, {
  //       method: "DELETE",
  //     });

  //     //deleting a city in always to filter because we want a
  //     //new array to show there without the selected id
  //     setCites((cities) => cities.filter((city) => city.id !== id));
  //   } catch (err) {
  //     alert("There was an error deleting a city.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
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
