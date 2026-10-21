export function getReadingStatus(reading) {
  const { value, min, max } = reading;

  if (value >= min && value <= max) {
    return "Normal";
  }

  const warningMargin = (max - min) * 0.1;

  if (
    value >= min - warningMargin &&
    value <= max + warningMargin
  ) {
    return "Warning";
  }

  return "Critical";
}

export function getSystemStatus(system) {
  const statuses = system.readings.map((reading) =>
    getReadingStatus(reading)
  );

  if (statuses.includes("Critical")) {
    return "Critical";
  }

  if (statuses.includes("Warning")) {
    return "Warning";
  }

  return "Normal";
}

export function getPlantStatus(systems) {
  const statuses = systems.map((system) =>
    getSystemStatus(system)
  );

  if (statuses.includes("Critical")) {
    return "Critical";
  }

  if (statuses.includes("Warning")) {
    return "Warning";
  }

  return "Normal";
}