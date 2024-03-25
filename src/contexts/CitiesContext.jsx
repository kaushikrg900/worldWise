/* eslint-disable react/prop-types */
import {
  createContext,
  useState,
  useEffect,
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
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
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

    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };

    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  //   const [cities, setCities] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [currentCity, setCurrentCity] = useState({});

  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity } = state;

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        // alert("There was an error loading data...");
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
      //   finally {
      //     setIsLoading(false);
      //   }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({ type: "loading" });

    try {
      //   setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      //   setCurrentCity(data);

      dispatch({ type: "city/loaded", payload: data });
    } catch {
      //   alert("There was an error loading data...");
      dispatch({
        type: "rejected",
        payload: "There was an error loading data...",
      });
    }
    // finally {
    //   setIsLoading(false);
    // }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      //   setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities `, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      //   console.log(data);

      //   setCities((cities) => [...cities, data]);

      dispatch({ type: "cities/created", payload: data });

      //   setCurrentCity(data);
    } catch {
      //   alert("There was an error loading data...");
      dispatch({
        type: "rejected",
        payload: "There was an error loading data...",
      });
    }
    // finally {
    //   setIsLoading(false);
    // }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      //   setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id} `, {
        method: "DELETE",
      });

      //   setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({ type: "cities/deleted", payload: id });
    } catch {
      alert("There was an error deleting city...");
    }
    // finally {
    //   setIsLoading(false);
    // }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the cities provider");
  return context;
}

export { CitiesProvider, useCities, CitiesContext };