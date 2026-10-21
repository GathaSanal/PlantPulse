import Alerts from "../components/Alerts.jsx";

function AlertsPage() {
  return (
    <main>
      <h1>Active Alerts</h1>
      <p>
        Monitor process parameters that are outside
        their normal operating limits.
      </p>

      <Alerts />
    </main>
  );
}

export default AlertsPage;