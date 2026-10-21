import { useState } from "react";
import styles from "./SystemTrendChart.module.css";

const statusLevels = {
  Normal: 0,
  Warning: 1,
  Critical: 2
};

function SystemTrendChart({ systems, events }) {
  const [selectedSystemId, setSelectedSystemId] = useState(
    String(systems[0]?.id ?? "")
  );

  const selectedSystem = systems.find(
    (system) => String(system.id) === selectedSystemId
  );

  const systemEvents = events
    .filter(
      (event) =>
        event.systemName === selectedSystem?.name &&
        Object.hasOwn(statusLevels, event.systemStatus) &&
        !Number.isNaN(Date.parse(event.timestamp))
    )
    .sort(
      (a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

  const points = systemEvents.map((event) => ({
    id: event.id,
    timestamp: event.timestamp,
    status: event.systemStatus,
    level: statusLevels[event.systemStatus]
  }));

  const left = 90;
  const right = 550;
  const top = 35;
  const bottom = 225;

  function xPosition(index) {
    if (points.length === 1) {
      return (left + right) / 2;
    }

    return (
      left +
      (index / (points.length - 1)) * (right - left)
    );
  }

  function yPosition(level) {
    return bottom - (level / 2) * (bottom - top);
  }

  function statusColor(status) {
    if (status === "Critical") return "#ef4444";
    if (status === "Warning") return "#f59e0b";
    return "#22c55e";
  }

  const linePoints = points
    .map((point, index) =>
      `${xPosition(index)},${yPosition(point.level)}`
    )
    .join(" ");

  return (
    <section className={styles.card}>
      <h2 className={styles.chartTitle}>System Criticality Over Time</h2>

      <div className={styles.field}>
        <label htmlFor="trendSystem">Select System</label>

        <select
          id="trendSystem"
          value={selectedSystemId}
          onChange={(event) =>
            setSelectedSystemId(event.target.value)
          }
        >
          {systems.map((system) => (
            <option key={system.id} value={String(system.id)}>
              {system.name}
            </option>
          ))}
        </select>
      </div>

      {points.length === 0 ? (
        <p className={styles.empty}>
          No system status history recorded yet.
          Update a reading to start tracking criticality.
        </p>
      ) : (
        <>
          <svg
            viewBox="0 0 600 285"
            className={styles.chart}
            role="img"
            aria-label={`Criticality history for ${selectedSystem.name}`}
          >
            {["Normal", "Warning", "Critical"].map(
              (status) => {
                const level = statusLevels[status];
                const y = yPosition(level);

                return (
                  <g key={status}>
                    <line
                      x1={left}
                      x2={right}
                      y1={y}
                      y2={y}
                      stroke="#475569"
                      strokeDasharray="5 5"
                    />

                    <text
                      x="12"
                      y={y + 5}
                      fontSize="14"
                      fill={statusColor(status)}
                    >
                      {status}
                    </text>
                  </g>
                );
              }
            )}

            <polyline
              points={linePoints}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {points.map((point, index) => (
              <g key={point.id}>
                <circle
                  cx={xPosition(index)}
                  cy={yPosition(point.level)}
                  r="6"
                  fill={statusColor(point.status)}
                  stroke="#ffffff"
                  strokeWidth="1"
                >
                  <title>
                    {`${point.status} — ${new Date(
                      point.timestamp
                    ).toLocaleString()}`}
                  </title>
                </circle>

                <text
                  x={xPosition(index)}
                  y="255"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#cbd5e1"
                >
                  {index + 1}
                </text>
              </g>
            ))}
          </svg>

          <p className={styles.note}>
            Each numbered point represents a recorded
            system status after a reading update.
          </p>

          <div className={styles.legend}>
            <span>🟢 Normal</span>
            <span>🟡 Warning</span>
            <span>🔴 Critical</span>
          </div>

          <h3>Recorded Status Changes</h3>

          <div className={styles.history}>
            {points.map((point, index) => (
              <div key={point.id} className={styles.historyRow}>
                <span>#{index + 1}</span>

                <span
                  style={{
                    color: statusColor(point.status)
                  }}
                >
                  {point.status}
                </span>

                <span>
                  {new Date(point.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default SystemTrendChart;