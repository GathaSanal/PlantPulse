
import { useContext } from "react";
import { PlantContext } from "../context/PlantContext";
import { getPlantStatus } from "../utils/status.jsx";
import SystemCard from "../components/SystemCard.jsx";
import "./Dashboard.css";

function Dashboard() {
  const {
    systems,
    handleResetDemo,
    isReady
  } = useContext(PlantContext);

  const plantStatus = getPlantStatus(systems);

  return (
    <main className="dashboard">
      <div className="dashboardHeader">
        <div>
          <h1>Plant Dashboard</h1>
          <p className="dashboardSubtitle">
            Monitor your water treatment systems
          </p>
        </div>

        <button
          className="resetButton"
          onClick={handleResetDemo}
          disabled={!isReady}
        >
          🔄
        </button>
      </div>

      <div className="dashboardSummary">
        <div className="summaryItem">
          <span>Plant Status:</span>
          <strong
            className={`plantStatusValue ${plantStatus.toLowerCase()}`}
          >
            {plantStatus}
          </strong>
        </div>

        <div className="summaryItem">
          <span>Systems Monitored:</span>
          <strong>{systems.length}</strong>
        </div>
      </div>

      <div className="systemsHeading">
        <h2>Systems Overview</h2>
      </div>

      <div className="systemGrid">
        {systems.map((system) => (
          <SystemCard
            key={system.id}
            system={system}
          />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
