import { useContext } from "react";
import { PlantContext } from "../context/PlantContext";
import styles from "./EventHistory.module.css";

function EventHistory() {
  const { events } = useContext(PlantContext);

  function statusClass(status) {
    if (status === "Critical") return styles.critical;
    if (status === "Warning") return styles.warning;
    return styles.normal;
  }

  return (
    <section className={styles.container}>
      <h2>Event History ({events.length})</h2>

      {events.length === 0 ? (
        <p className={styles.empty}>
          No process changes recorded yet.
        </p>
      ) : (
        events.map((event) => (
          <article
            key={event.id}
            className={styles.eventCard}
          >
            <div className={styles.eventHeader}>
              <h3 className={styles.eventTitle}>
                {event.systemName} — {event.parameter}
              </h3>

              <span
                className={`${styles.status} ${statusClass(event.status)}`}
              >
                {event.status}
              </span>
            </div>

            <div className={styles.change}>
              <span className={styles.oldValue}>
                {event.oldValue} {event.unit}
              </span>

              <span className={styles.arrow}>→</span>

              <span className={styles.newValue}>
                {event.newValue} {event.unit}
              </span>
            </div>

            <small className={styles.timestamp}>
              {new Date(event.timestamp).toLocaleString()}
            </small>
          </article>
        ))
      )}
    </section>
  );
}

export default EventHistory;