import { useState } from "react";
import { Cable } from "../lib/data/Cable";
import Button from "./Button";
import Dialog from "./Dialog";
import { useDialogContext } from "../hooks/useDialog";
import useStore from "./flow/store";
import { useRecalculateFlip } from "./flow/recalculateFlipContext";

type CableSettingsDialogProps = {
  cable: Cable;
};

export default function CableSettingsDialog({ cable }: CableSettingsDialogProps) {
  const dialogContext = useDialogContext();
  const { recalculateFlip } = useRecalculateFlip();
  const updateCableEdge = useStore((state) => state.updateCableEdge);

  const [length, setLength] = useState<number>(cable.length);

  function handleSave() {
    if (isNaN(length) || length <= 0) {
      alert("Bitte gib eine gültige Länge ein.");
      return;
    }

    cable.length = length;

    // Update the cable edge in store
    updateCableEdge(cable);

    recalculateFlip();
    dialogContext?.closeDialog();
  }

  return (
    <Dialog
      title="Kabeleinstellungen"
      footer={
        <>
          <Button type="primary" onClick={handleSave}>
            Speichern
          </Button>
          <Button type="secondary" onClick={() => dialogContext?.closeDialog()}>
            Abbrechen
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-black">Leitungslänge in m:</label>
          <input
            className="border border-gray-300 px-2 py-1 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-thw"
            type="number"
            min={0.1}
            step={0.1}
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </Dialog>
  );
}
