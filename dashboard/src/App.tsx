import { useEffect, useState } from "react";
import "./App.css";
import VesselMap from "./components/VesselMap";

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

function App() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/vessels")
      .then((response) => response.json())
      .then((data) => {
        setVessels(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load AIS data:", error);
        setLoading(false);
      });
  }, []);

  const totalRecords = vessels.length;

  const anomalyCount = vessels.filter(
    (vessel) => vessel.anomaly === -1
  ).length;

  const trackedVessels = new Set(
    vessels.map((vessel) => vessel.MMSI)
  ).size;

  const anomalyRate =
    totalRecords > 0
      ? ((anomalyCount / totalRecords) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>⚓ AIS Watch</h2>

        <nav>
          <a className="active">Dashboard</a>
          <a>Vessels</a>
          <a>Anomalies</a>
          <a>Analytics</a>
        </nav>

        <div className="system-status">
          <span></span>
          System Online
        </div>
      </aside>

      <main className="main">
        <header>
          <div>
            <h1>Maritime Surveillance</h1>
            <p>AI-powered AIS anomaly detection</p>
          </div>

          <div className="status">
            ● LIVE
          </div>
        </header>

        <section className="metrics">

          <div className="card">
            <p>Tracked Vessels</p>
            <h2>
              {loading ? "..." : trackedVessels}
            </h2>
          </div>

          <div className="card">
            <p>AIS Records</p>
            <h2>
              {loading ? "..." : totalRecords.toLocaleString()}
            </h2>
          </div>

          <div className="card">
            <p>Potential Anomalies</p>
            <h2>
              {loading ? "..." : anomalyCount}
            </h2>
          </div>

          <div className="card">
            <p>Anomaly Rate</p>
            <h2>
              {loading ? "..." : `${anomalyRate}%`}
            </h2>
          </div>

        </section>

        <section className="content-grid">

          <div className="map-card">
            <div className="card-header">
              <h2>Vessel Activity</h2>
              <span>Syros, Greece</span>
            </div>

            <VesselMap />
          </div>

          <div className="alerts-card">
            <div className="card-header">
              <h2>Recent Anomalies</h2>
              <span>{anomalyCount} detected</span>
            </div>

            {vessels
              .filter((vessel) => vessel.anomaly === -1)
              .sort(
                (a, b) =>
                  a.anomaly_score - b.anomaly_score
              )
              .slice(0, 3)
              .map((vessel, index) => (
                <div className="alert" key={index}>
                  <b>🚨 Potential Anomaly</b>

                  <p>
                    Unusual vessel behavior detected
                  </p>

                  <small>
                    Score:{" "}
                    {vessel.anomaly_score.toFixed(3)}
                  </small>
                </div>
              ))}

          </div>

        </section>
      </main>
    </div>
  );
}

export default App;