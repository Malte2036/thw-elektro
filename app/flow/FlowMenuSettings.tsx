import { Button } from "@/components/Button";
import FlowMenuItem from "./FlowMenuItem";
import { exportPredefinedData, importPredefinedData } from "../lib/db/export";
import {
  bulkSavePredefined,
  deleteAllPredefined,
  getPredefined,
} from "../lib/db/save";
import { ChangeEvent, useState } from "react";
import { Predefined } from "../lib/data/Predefined";

type FlowMenuSettingsProps = {
  openPredefinedPage: () => void;
};

export default function FlowMenuSettings({
  openPredefinedPage,
}: FlowMenuSettingsProps) {
  const [file, setFile] = useState<File>();

  async function startExport() {
    const data = await getPredefined();
    exportPredefinedData(data);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function startImport() {
    if (!file) {
      return;
    }

    try {
      const data: Predefined[] = await importPredefinedData(file);
      if (data.length > 0) {
        await bulkSavePredefined(data);
        console.log("Imported predefined data");

        openPredefinedPage();
      }
    } catch (error) {
      alert("Fehler beim Importieren der Konfiguration");
    }
  }

  async function startDelete() {
    const confirmed = window.confirm(
      "Bist du dir sicher, dass du die Konfiguration unwiderruflich löschen möchtest?"
    );

    if (confirmed) {
      await deleteAllPredefined();
      console.log("Deleted all predefined data");

      openPredefinedPage();
    }
  }

  return (
    <>
      <FlowMenuItem>
        <div>Hiermit kann die aktuelle Konfiguration exportiert werden.</div>
        <Button onClick={startExport} type="secondary">
          Exportieren
        </Button>
      </FlowMenuItem>
      <FlowMenuItem>
        <div>
          Hiermit kann die Konfiguration eines anderen Nutzers importiert
          werden.
        </div>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <Button
          onClick={startImport}
          type="secondary"
          disabled={file == undefined}
        >
          Importieren
        </Button>
      </FlowMenuItem>
      <FlowMenuItem>
        <div>Hiermit kann die aktuelle Konfiguration gelöscht werden.</div>
        <Button onClick={startDelete} type="secondary">
          Konfiguration löschen
        </Button>
      </FlowMenuItem>
    </>
  );
}
