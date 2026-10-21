import { useContext } from "react";
import { PlantContext } from "../context/PlantContext.jsx";
import { getReadingStatus } from "../utils/status.jsx";
import styles from "./Alerts.module.css";

function Alerts() {
  const { systems } = useContext(PlantContext);

  const alerts = systems.flatMap((system) =>
    system.readings
      .filter(
        (reading) => getReadingStatus(reading) !== "Normal"
      )
      .map((reading) => ({
        id: `${system.id}-${reading.key}`,
        systemName: system.name,
        parameter: reading.label,
        value: reading.value,
        unit: reading.unit,
        status: getReadingStatus(reading)
      }))
  );

  if (alerts.length === 0) {
    return (
      <div className={styles.empty}>
        All systems are operating within normal limits.
      </div>
    );
  }

  return (
    <section className={styles.container}>
      {alerts.map((alert) => (
        <article
          key={alert.id}
          className={`${styles.alertCard} ${
            alert.status === "Critical"
              ? styles.critical
              : styles.warning
          }`}
        >
          <div className={styles.alertHeader}>
            <h3 className={styles.systemName}>
              {alert.systemName} — {alert.parameter}
            </h3>

            <span className={styles.badge}>
              {alert.status}
            </span>
          </div>

          <p className={styles.value}>
            {alert.value} {alert.unit}
          </p>

          <p className={styles.description}>
            {alert.status === "Critical"
              ? "Reading outside critical operating limits."
              : "Reading outside normal operating limits."}
          </p>
        </article>
      ))}
    </section>
  );
}

export default Alerts;