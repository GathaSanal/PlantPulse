import { useContext } from "react";
import { PlantContext } from "../context/PlantContext.jsx";
import SystemTrendChart from "../components/SystemTrendChart.jsx";


function SystemTrends() {
  const { systems, events } = useContext(PlantContext);

  return (
    <main>
      <h1 className="trendsTitle">System Criticality Trends</h1>

      <p>
        Track how system operating conditions change
        between Normal, Warning, and Critical.
      </p>

      <SystemTrendChart
        systems={systems}
        events={events}
      />
    </main>
  );
}

export default SystemTrends;