import Button from "../../../components/Button";
import FlowMenuItem from "./FlowMenuItem";
import {
  exportPredefinedData,
  importPredefinedData,
} from "../../../lib/db/export";
import {
  bulkSavePredefined,
  deleteAllPredefined,
  getPredefined,
} from "../../../lib/db/save";
import { ChangeEvent, useState } from "react";
import { Predefined } from "../../../lib/data/Predefined";
import { useDialogContext } from "../../../hooks/useDialog";
import ConfirmDialog from "../../ConfirmDialog";

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
      alert("Fehler beim Importieren der Templates.");
    }
  }

  const dialogContext = useDialogContext();

  async function startDelete() {
    dialogContext?.setDialog(
      <ConfirmDialog title="Löschen" question="Bist du dir sicher, dass du alle Templates unwiderruflich löschen möchtest?" onConfirm={
        async () => {
          await deleteAllPredefined();
          console.log("Deleted all predefined data");

          openPredefinedPage();
        }
      } />
    )
  }

  return (
    <>
      <FlowMenuItem>
        <div>Hiermit können alle aktuellen Templates exportiert werden.</div>
        <Button onClick={startExport} type="secondary">
          Exportieren
        </Button>
      </FlowMenuItem>
      <FlowMenuItem>
        <div>
          Hiermit können alle Templates eines anderen Nutzers importiert werden.
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
        <div>
          Hiermit können alle aktuellen Templates unwiderruflich gelöscht
          werden.
        </div>
        <Button onClick={startDelete} type="secondary">
          Templates löschen
        </Button>
      </FlowMenuItem>
    </>
  );
}
