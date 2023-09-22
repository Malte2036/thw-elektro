import { useDialogContext } from "../hooks/useDialog";
import Dialog from "./Dialog";

export default function InfoDialog() {
  const dialogContext = useDialogContext();

  return (
    <Dialog header="Spannungsfall">
      <div className="flex flex-col gap-0">
        <div className="text-lg font-bold">
          Berechne den Spannungsfall und die maximale Leistung:
        </div>
        <div>
          Diese interaktive Anwendung ermöglicht dir die einfache Berechnung des
          Spannungsfalls (in Prozent) in einer Leitung sowie der maximalen
          Leistung (in kW).
        </div>
      </div>
      <div className="flex flex-col gap-0">
        <div className="text-lg font-bold">Daten eingeben: </div>
        <div>
          Gib die relevanten Informationen wie Leitungslänge,
          Leitungsquerschnitt, Strom und Spannung ein. Die App führt automatisch
          die Berechnungen durch und zeigt den ermittelten Spannungsfall und die
          maximale Leistung an.
        </div>
      </div>
      <div className="flex flex-col gap-0">
        <div className="text-lg font-bold"> Leitung aufbauen:</div>
        <div>
          Erstelle die Leitung ganz einfach mit dem Menu (rechts). Wähle die
          benötigten Leitungselemente aus dem Menü und füge sie zum
          Flow-Diagramm hinzu. Du kannst die Leitungselemente mit der Maus
          verschieben und mithilfe der Kabel verbinden.
        </div>
      </div>
      <div>
        Die App berechnet automatisch den Spannungsfall und die maximale
        Leistung anhand der eingegebenen Daten.
      </div>
      <div className="italic">
        Keinerlei Gewähr für die Richtigkeit der Berechnungen.
      </div>

      <thw-button type="primary" onClick={() => dialogContext?.closeDialog()}>
        Okay
      </thw-button>
    </Dialog>
  );
}
