import { useRef } from "react";
import { Button } from "./Button";

type DialogProps = {
  closeDialog: () => void;
};

export default function Dialog({ closeDialog }: DialogProps) {
  const outerDivRef = useRef<HTMLDivElement>(null);

  const handleOuterDivClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Check if the clicked target is the outerDiv itself or its children
    if (
      event.target === outerDivRef.current ||
      !isDescendant(outerDivRef.current, event.target as HTMLElement)
    ) {
      // Handle click on the outerDiv here
      closeDialog();
    }
  };

  const isDescendant = (
    parent: HTMLElement | null,
    child: HTMLElement
  ): boolean => {
    let node: HTMLElement | null = child.parentElement;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
      ref={outerDivRef}
      onClick={handleOuterDivClick}
    >
      <div className="relative p-4 bg-white rounded-md shadow-md flex flex-col gap-2 max-w-md m-4">
        <div className="text-2xl text-thw font-bold">Spannungsfall</div>

        <div className="flex flex-col gap-0">
          <div className="text-lg font-bold">
            Berechne den Spannungsfall und die maximale Leistung:
          </div>
          <div>
            Diese interaktive Anwendung ermöglicht dir die einfache Berechnung
            des Spannungsfalls (in Prozent) in einer Leitung sowie der maximalen
            Leistung (in kW).
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <div className="text-lg font-bold">Daten eingeben: </div>
          <div>
            Gib die relevanten Informationen wie Leitungslänge,
            Leitungsquerschnitt, Strom und Spannung ein. Die App führt
            automatisch die Berechnungen durch und zeigt den ermittelten
            Spannungsfall und die maximale Leistung an.
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
          Die App berechnet automatisch den Spannungsfall und die maximale Leistung anhand der eingegebenen Daten.
        </div>

        <Button type="primary" onClick={() => closeDialog()}>
          Okay
        </Button>
      </div>
    </div>
  );
}
