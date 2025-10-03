import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const navigate = useNavigate();

  const [searchParams, ] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  console.log("LAT LNG", lat, lng);

  return (
    <div className={styles.mapContainer} onClick={() => navigate("/app/form")}>
      <p>Map side here</p>
    </div>
  );
}

export default Map;
