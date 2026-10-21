import { getReadingStatus, getSystemStatus } from "../utils/status.jsx";
import styles from "./SystemCard.module.css";
import KPIGauge from "./KPIGauge.jsx";

function SystemCard({ system }) {
  const systemStatus = getSystemStatus(system);

  function statusClass(status) {
    if (status === "Critical") return styles.critical;
    if (status === "Warning") return styles.warning;
    return styles.normal;
  }

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{system.name}</h2>

        <span
          className={`${styles.status} ${statusClass(systemStatus)}`}
        >
          {systemStatus}
        </span>
      </div>

      <div className={styles.readings}>
        {system.readings.map((reading) => {
          const readingStatus = getReadingStatus(reading);

          return (
            <div className={styles.reading} key={reading.key}>
  <div className={styles.readingHeader}>
    <span className={styles.readingLabel}>
      {reading.label}
    </span>

    <span className={styles.readingValue}>
      {reading.value} {reading.unit}
    </span>
  </div>

  <div className={styles.readingStatus}>
    <span
      className={`${styles.status} ${statusClass(readingStatus)}`}
    >
      {readingStatus}
    </span>
  </div>
  <KPIGauge reading={reading} />
</div>
          );
        })}
      </div>
    </article>
  );
}

export default SystemCard;