import { useContext } from "react";
import { PlantContext } from "../context/PlantContext";
import UpdateReadingForm from "../components/UpdateReadingForm.jsx";

function UpdateReading() {
  const { systems, handleUpdateReading } = useContext(PlantContext);

  return (
    <main>
      <h1>Update Process Reading</h1>
      <p>
        Select an industrial system and update a parameter
        to simulate a process change.
      </p>

      <UpdateReadingForm
        systems={systems}
        onUpdate={handleUpdateReading}
      />
    </main>
  );
}

export default UpdateReading;