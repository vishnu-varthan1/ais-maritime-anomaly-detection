import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface Vessel {
  MMSI: number;
  TIMESTAMP: string;
  LAT: number;
  LON: number;
  SOG: number;
  COG: number;
  anomaly: number;
  anomaly_score: number;
}

function MapController({ vessels }: { vessels: Vessel[] }) {
  const map = useMap();

  useEffect(() => {
    if (vessels.length === 0) return;

    const bounds = vessels.map(
      (vessel) => [vessel.LAT, vessel.LON] as [number, number]
    );

    map.fitBounds(bounds, {
      padding: [30, 30],
    });
  }, [vessels, map]);

  return null;
}

function VesselMap() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/vessels")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch AIS data");
        }

        return response.json();
      })
      .then((data) => {
        setVessels(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load AIS data:", error);
        setLoading(false);
      });
  }, []);

  const track: [number, number][] = vessels.map(
    (vessel) => [vessel.LAT, vessel.LON]
  );

  const anomalies = vessels.filter(
    (vessel) => vessel.anomaly === -1
  );

  if (loading) {
    return (
      <div className="map-placeholder">
        Loading AIS data...
      </div>
    );
  }

  return (
    <MapContainer
      center={[37.45, 24.96]}
      zoom={12}
      style={{
        height: "500px",
        width: "100%",
      }}
    >
      <MapController vessels={vessels} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Real vessel track */}
      <Polyline
        positions={track}
        pathOptions={{
          weight: 3,
        }}
      />

      {/* Real anomaly locations */}
      {anomalies.map((vessel, index) => (
        <CircleMarker
          key={index}
          center={[vessel.LAT, vessel.LON]}
          radius={
            vessel.anomaly_score < -0.20
              ? 12
              : vessel.anomaly_score < -0.10
              ? 9
              : 7
          }
          pathOptions={{
            weight: 2,
          }}
        >
          <Popup>
            <strong>🚨 Potential AIS Anomaly</strong>
            <br />
            MMSI: {vessel.MMSI}
            <br />
            Time: {vessel.TIMESTAMP}
            <br />
            Speed: {vessel.SOG} knots
            <br />
            Course: {vessel.COG}°
            <br />
            Score: {vessel.anomaly_score.toFixed(3)}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default VesselMap;