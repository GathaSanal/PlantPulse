import { useState } from "react";
import styles from "./UpdateReadingForm.module.css";

function UpdateReadingForm({ systems, onUpdate }) {
  const [selectedSystemId, setSelectedSystemId] = useState(
    systems[0].id
  );

  const [selectedReadingKey, setSelectedReadingKey] = useState(
    systems[0].readings[0].key
  );

  const [newValue, setNewValue] = useState("");

  const selectedSystem = systems.find(
    (system) => system.id === Number(selectedSystemId)
  ) ?? systems[0];

  function handleSystemChange(event) {
    const systemId = Number(event.target.value);

    const system = systems.find(
      (item) => item.id === systemId
    );

    if (!system) return;

    setSelectedSystemId(systemId);
    setSelectedReadingKey(system.readings[0].key);
    setNewValue("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (newValue.trim() === "") return;

    const value = Number(newValue);

    if (!Number.isFinite(value)) return;

    onUpdate(
      selectedSystemId,
      selectedReadingKey,
      value
    );

    setNewValue("");
  }

  return (
    <section className={styles.formCard}>
      <h2 className={styles.title}>
        Update Process Reading
      </h2>

      <p className={styles.description}>
        Simulate a process change by updating a parameter.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="system">
            Select System
          </label>

          <select
            id="system"
            className={styles.input}
            value={selectedSystemId}
            onChange={handleSystemChange}
          >
            {systems.map((system) => (
              <option key={system.id} value={system.id}>
                {system.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="reading">
            Select Parameter
          </label>

          <select
            id="reading"
            className={styles.input}
            value={selectedReadingKey}
            onChange={(event) =>
              setSelectedReadingKey(event.target.value)
            }
          >
            {selectedSystem.readings.map((reading) => (
              <option key={reading.key} value={reading.key}>
                {reading.label} ({reading.unit})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="value">
            New Reading
          </label>

          <input
            id="value"
            className={styles.input}
            type="number"
            step="any"
            placeholder="Enter a new value"
            value={newValue}
            onChange={(event) =>
              setNewValue(event.target.value)
            }
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
        >
          Update Reading
        </button>
      </form>
    </section>
  );
}

export default UpdateReadingForm;