
import { useContext } from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import { PlantContext } from "./context/PlantContext";
import { getReadingStatus } from "./utils/status.jsx";

import Dashboard from "./Pages/Dashboard.jsx";
import History from "./Pages/History.jsx";
import UpdateReading from "./Pages/UpdateReading.jsx";
import AlertsPage from "./Pages/AlertsPage.jsx";
import SystemTrends from "./Pages/SystemTrends.jsx";

import "./App.css";

function App() {
  const { systems } = useContext(PlantContext);

  // Count all readings currently in Warning or Critical status.
  const activeAlertCount = systems.reduce((count, system) => {
    const systemAlerts = system.readings.filter(
      (reading) => getReadingStatus(reading) !== "Normal"
    );

    return count + systemAlerts.length;
  }, 0);

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="logo">◉</span>

          <div>
            <h1 className="brandName">PlantPulse</h1>
            <p className="subtitle">
              Industrial Process Monitoring Dashboard
            </p>
          </div>
        </div>

        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navLink ${isActive ? "activeLink" : ""}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `navLink ${isActive ? "activeLink" : ""}`
            }
          >
            Active Alerts

            {activeAlertCount > 0 && (
              <span className="alertCount">
                {activeAlertCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/update"
            className={({ isActive }) =>
              `navLink ${isActive ? "activeLink" : ""}`
            }
          >
            Update Reading
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `navLink ${isActive ? "activeLink" : ""}`
            }
          >
            Event History
          </NavLink>

          <NavLink
            to="/trends"
            className={({ isActive }) =>
              `navLink ${isActive ? "activeLink" : ""}`
            }
          >
            System Trends
          </NavLink>
        </nav>
      </header>

      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/update" element={<UpdateReading />} />
          <Route path="/history" element={<History />} />
          <Route path="/trends" element={<SystemTrends />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
