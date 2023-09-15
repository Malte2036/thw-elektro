import Button from "../../../components/Button";
import FlowMenuItem from "./FlowMenuItem";
import {
  exportDataAsJson,
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
import * as ReactFlow from "reactflow";

type FlowMenuSettingsProps = {
  openPredefinedPage: () => void;
};

export default function FlowMenuSettings({
  openPredefinedPage,
}: FlowMenuSettingsProps) {
  const [file, setFile] = useState<File>();


  const flow = ReactFlow.useReactFlow();

  async function startTemplateExport() {
    const data = await getPredefined();
    exportDataAsJson("exported_templates.json", data);
  }

  async function startFlowExport() {
    exportDataAsJson("exported_flow.json", flow.toObject());
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function startTemplateImport() {
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

  async function startTemplateDelete() {
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
        <div>Hiermit kann der derzeitige Flow exportiert werden.</div>
        <Button onClick={startFlowExport} type="secondary">
          Exportieren
        </Button>
      </FlowMenuItem>
      <FlowMenuItem>
        <div>Hiermit können alle aktuellen Templates exportiert werden.</div>
        <Button onClick={startTemplateExport} type="secondary">
          Exportieren
        </Button>
      </FlowMenuItem>
      <FlowMenuItem>
        <div>
          Hiermit können alle Templates eines anderen Nutzers importiert werden.
        </div>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <Button
          onClick={startTemplateImport}
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
        <Button onClick={startTemplateDelete} type="secondary">
          Templates löschen
        </Button>
      </FlowMenuItem>
    </>
  );
}
