
import { useState, useEffect, useRef } from "react";
import { PlantContext } from "./PlantContext";
import { initialSystems } from "../data/systems.jsx";
import { loadSavedArray } from "../utils/storage.jsx";
import {
  getReadingStatus,
  getSystemStatus
} from "../utils/status.jsx";

// Communicate with JSONBin through the local Node.js backend.
async function fetchCloudData() {
  const response = await fetch("/api/plant");

  if (!response.ok) {
    throw new Error(`Cloud load failed: ${response.status}`);
  }

  return response.json();
}

async function uploadCloudData(data) {
  const response = await fetch("/api/plant", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Cloud save failed: ${response.status}`);
  }
}

export default function PlantProvider({ children }) {
  // Start with locally saved data.
  const [plantData, setPlantData] = useState(() => ({
    systems: loadSavedArray(
      "plantpulse-systems",
      initialSystems
    ),
    events: loadSavedArray(
      "plantpulse-events",
      []
    )
  }));

  const [cloudStatus, setCloudStatus] = useState("loading");

  // Keep the latest data accessible to async functions.
  const dataRef = useRef(plantData);

  // Queue writes so they reach JSONBin in order.
  const saveQueue = useRef(Promise.resolve());

  // Prevent edits while initial cloud loading is incomplete.
  const [isReady, setIsReady] = useState(false);

  const { systems, events } = plantData;

  // Update React state and the latest-data reference together.
  function updateLocalData(data) {
    dataRef.current = data;
    setPlantData(data);
  }

  // Queue an online save.
  function saveToCloud(data) {
    setCloudStatus("saving");

    const operation = saveQueue.current.then(async () => {
      await uploadCloudData(data);
    });

    saveQueue.current = operation.catch(() => {});

    operation
      .then(() => {
        // Only show "saved" for the latest queued snapshot.
        if (dataRef.current === data) {
          setCloudStatus("saved");
        }
      })
      .catch((error) => {
        console.error("PlantPulse save error:", error);

        if (dataRef.current === data) {
          setCloudStatus("offline");
        }
      });

    return operation;
  }

  // Load cloud data once when the provider mounts.
  useEffect(() => {
    let cancelled = false;

    async function initializePlant() {
      try {
        const cloudData = await fetchCloudData();

        if (cancelled) return;

        const validCloudData =
          Array.isArray(cloudData?.systems) &&
          cloudData.systems.length > 0 &&
          Array.isArray(cloudData?.events);

        if (validCloudData) {
          updateLocalData({
            systems: cloudData.systems,
            events: cloudData.events
          });

          setCloudStatus("saved");
        } else {
          // Empty bin: upload the existing local data.
          const localData = dataRef.current;

          await saveToCloud(localData);

          if (cancelled) return;
        }
      } catch (error) {
        if (!cancelled) {
          console.error("PlantPulse load error:", error);
          setCloudStatus("offline");
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    initializePlant();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist systems and events locally.
  useEffect(() => {
    localStorage.setItem(
      "plantpulse-systems",
      JSON.stringify(systems)
    );

    localStorage.setItem(
      "plantpulse-events",
      JSON.stringify(events)
    );
  }, [systems, events]);

  // Update a system reading and record the event.
  function handleUpdateReading(systemId, readingKey, newValue) {
    if (!isReady) return;

    const currentData = dataRef.current;

    const system = currentData.systems.find(
      item => String(item.id) === String(systemId)
    );

    const reading = system?.readings.find(
      item => item.key === readingKey
    );

    if (!reading || !Number.isFinite(newValue)) return;
    if (reading.value === newValue) return;

    const updatedReading = {
      ...reading,
      value: newValue
    };

    const updatedSystem = {
      ...system,
      readings: system.readings.map(item =>
        item.key === readingKey
          ? updatedReading
          : item
      )
    };

    const newEvent = {
      id: crypto.randomUUID(),
      systemName: system.name,
      parameter: reading.label,
      oldValue: reading.value,
      newValue,
      systemStatus: getSystemStatus(updatedSystem),
      unit: reading.unit,
      status: getReadingStatus(updatedReading),
      timestamp: new Date().toISOString()
    };

    const updatedData = {
      systems: currentData.systems.map(item =>
        String(item.id) === String(systemId)
          ? updatedSystem
          : item
      ),
      events: [
        newEvent,
        ...currentData.events
      ]
    };

    updateLocalData(updatedData);
    saveToCloud(updatedData);
  }

  // Restore the demo and clear all history.
  function handleResetDemo() {
    if (!isReady) return;

    const confirmed = window.confirm(
      "Reset all readings and clear event history?"
    );

    if (!confirmed) return;

    const resetData = {
      systems: structuredClone(initialSystems),
      events: []
    };

    updateLocalData(resetData);
    saveToCloud(resetData);
  }

  return (
    <PlantContext.Provider
      value={{
        systems,
        events,
        handleUpdateReading,
        handleResetDemo,
        cloudStatus,
        isReady
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}
