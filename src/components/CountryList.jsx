import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Messgae from "./Message";
import styles from "./CountryList.module.css";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
    const {cities, isLoading} = useCities();

  if (isLoading) return <Spinner />;

  if(!cities.length) return <Messgae message="Add your country first by clicking on the map."/>

  const countries = cities.reduce((arr, city) => {
    if(!arr.map(el => el.country).includes(city.country)) {
        return [...arr, { country: city.country, emoji: city.emoji }]
    } else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => {
        return <CountryItem country={country} />;
      })}
    </ul>
  );
}

export default CountryList;
