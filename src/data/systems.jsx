export const initialSystems = [
  {
    id: 1,
    name: "RO System",
    readings: [
      { key: "pressure", label: "Pressure", value: 4.2, unit: "bar", min: 2, max: 6 },
      { key: "flow", label: "Flow", value: 42, unit: "L/min", min: 20, max: 60 },
      { key: "conductivity", label: "Conductivity", value: 35, unit: "µS/cm", min: 0, max: 100 }
    ]
  },
  {
    id: 2,
    name: "Cooling Water System",
    readings: [
      { key: "temperature", label: "Temperature", value: 28, unit: "°C", min: 15, max: 40 },
      { key: "ph", label: "pH", value: 7.4, unit: "", min: 6.5, max: 8.5 },
      { key: "conductivity", label: "Conductivity", value: 850, unit: "µS/cm", min: 100, max: 1500 }
    ]
  },
  {
    id: 3,
    name: "Storage Tank",
    readings: [
      { key: "level", label: "Tank Level", value: 76, unit: "%", min: 20, max: 95 }
    ]
  }
];