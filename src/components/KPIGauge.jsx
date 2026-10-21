import { getReadingStatus } from "../utils/status.jsx";
import styles from "./KPIGauge.module.css";

function KPIGauge({ reading }) {
  const { value, min, max, unit, label } = reading;

  const span = max - min;
  const tolerance = span * 0.1;

  const criticalLow = min - tolerance;
  const criticalHigh = max + tolerance;

  const axisMin = min - span * 0.5;
  const axisMax = max + span * 0.5;

  const left = 38;
  const chartWidth = 324;

  function position(number) {
    const clamped = Math.max(
      axisMin,
      Math.min(axisMax, number)
    );

    return (
      left +
      ((clamped - axisMin) / (axisMax - axisMin)) *
        chartWidth
    );
  }

  function format(number) {
    return Number(number.toFixed(2));
  }

  const zones = [
    { start: axisMin, end: criticalLow, color: "#dc2626" },
    { start: criticalLow, end: min, color: "#f59e0b" },
    { start: min, end: max, color: "#22c55e" },
    { start: max, end: criticalHigh, color: "#f59e0b" },
    { start: criticalHigh, end: axisMax, color: "#dc2626" }
  ];

  const ticks = [
    axisMin,
    criticalLow,
    min,
    max,
    criticalHigh,
    axisMax
  ];

  const status = getReadingStatus(reading);

  return (
    <div className={styles.gaugeContainer}>
      <svg
        viewBox="0 0 400 125"
        className={styles.gauge}
        role="img"
        aria-label={`${label}: ${value} ${unit}, ${status}`}
      >
        {zones.map((zone, index) => (
          <rect
            key={index}
            x={position(zone.start)}
            y="35"
            width={Math.max(
              0,
              position(zone.end) - position(zone.start)
            )}
            height="22"
            fill={zone.color}
          />
        ))}

        {ticks.map((tick, index) => (
          <g key={index}>
            <line
              x1={position(tick)}
              x2={position(tick)}
              y1="60"
              y2="68"
              stroke="#cbd5e1"
            />

            <text
              x={position(tick)}
              y="82"
              fontSize="10"
              textAnchor="middle"
              fill="#cbd5e1"
            >
              {format(tick)}
            </text>
          </g>
        ))}

        <line
          x1={position(value)}
          x2={position(value)}
          y1="22"
          y2="60"
          stroke="#ffffff"
          strokeWidth="2.5"
        />

        <path
          d={`M ${position(value) - 7} 15
              L ${position(value) + 7} 15
              L ${position(value)} 25 Z`}
          fill="#ffffff"
        />

        <text
          x={position(value)}
          y="11"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#ffffff"
        >
          {value}
        </text>

        <text
          x="200"
          y="110"
          textAnchor="middle"
          fontSize="11"
          fill="#94a3b8"
        >
          {label} ({unit})
        </text>
      </svg>

      <div className={styles.limits}>
        <span>
          Normal: {format(min)}–{format(max)} {unit}
        </span>

        <span>
          Warning limits: {format(criticalLow)} / {format(criticalHigh)}
        </span>
      </div>

      <div className={styles.legend}>
        <span><i className={styles.red}></i> Critical</span>
        <span><i className={styles.yellow}></i> Warning</span>
        <span><i className={styles.green}></i> Normal</span>
      </div>
    </div>
  );
}

export default KPIGauge;