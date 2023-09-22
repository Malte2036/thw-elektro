import FlowMenuItem from "./FlowMenuItem";
import { exportDataAsJson, importJsonData } from "../../../lib/db/export";
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
import { restoreFlow } from "../../../lib/flow/save";
import { useRecalculateFlip } from "../recalculateFlipContext";

type FlowMenuSettingsProps = {
  openPredefinedPage: () => void;
  closeMenu: () => void;
};

export default function FlowMenuSettings({
  openPredefinedPage,
}: FlowMenuSettingsProps) {
  const [templateFile, setTemplateFile] = useState<File>();
  const [flowFile, setFlowFile] = useState<File>();

  const { recalculateFlip: triggerRecalculation } = useRecalculateFlip();

  const flow = ReactFlow.useReactFlow();

  async function startTemplateExport() {
    const data = await getPredefined();
    exportDataAsJson("exported_templates.json", data);
  }

  async function handleTemplateFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setTemplateFile(e.target.files[0]);
    }
  }

  async function startTemplateImport() {
    if (!templateFile) {
      return;
    }

    try {
      const data: Predefined[] = await importJsonData(templateFile);
      if (data.length > 0) {
        await bulkSavePredefined(data);
        console.log("Imported predefined data");

        openPredefinedPage();
      }
    } catch (error) {
      alert("Fehler beim Importieren der Templates.");
    }
  }

  async function startFlowExport() {
    exportDataAsJson("exported_flow.json", flow.toObject());
  }

  async function handleFlowFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFlowFile(e.target.files[0]);
    }
  }

  async function startFlowImport() {
    if (!flowFile) {
      return;
    }

    try {
      const data = await importJsonData<ReactFlow.ReactFlowJsonObject>(
        flowFile
      );
      if (data) {
        restoreFlow(data, flow.setNodes, flow.setEdges);
        triggerRecalculation();
      }
    } catch (error) {
      alert("Fehler beim Importieren der Templates.");
    }
  }

  const dialogContext = useDialogContext();

  async function startTemplateDelete() {
    dialogContext?.setDialog(
      <ConfirmDialog
        title="Löschen"
        question="Bist du dir sicher, dass du alle Templates unwiderruflich löschen möchtest?"
        onConfirm={async () => {
          await deleteAllPredefined();
          console.log("Deleted all predefined data");

          openPredefinedPage();
        }}
      />
    );
  }

  return (
    <>
      <FlowMenuItem>
        <div>Hiermit kann der derzeitige Flow exportiert werden.</div>
        <thw-button onClick={startFlowExport} type="secondary">
          Exportieren
        </thw-button>
      </FlowMenuItem>{" "}
      <FlowMenuItem>
        <div>
          Hiermit kann ein Flow eines anderen Nutzers importiert werden.
        </div>
        <input type="file" accept=".json" onChange={handleFlowFileChange} />
        <thw-button
          onClick={startFlowImport}
          type="secondary"
          disabled={flowFile == undefined}
        >
          Importieren
        </thw-button>
      </FlowMenuItem>
      <FlowMenuItem>
        <div>Hiermit können alle aktuellen Templates exportiert werden.</div>
        <thw-button onClick={startTemplateExport} type="secondary">
          Exportieren
        </thw-button>
      </FlowMenuItem>
      <FlowMenuItem>
        <div>
          Hiermit können alle Templates eines anderen Nutzers importiert werden.
        </div>
        <input type="file" accept=".json" onChange={handleTemplateFileChange} />
        <thw-button
          onClick={startTemplateImport}
          type="secondary"
          disabled={templateFile == undefined}
        >
          Importieren
        </thw-button>
      </FlowMenuItem>
      <FlowMenuItem>
        <div>
          Hiermit können alle aktuellen Templates unwiderruflich gelöscht
          werden.
        </div>
        <thw-button onClick={startTemplateDelete} type="secondary">
          Templates löschen
        </thw-button>
      </FlowMenuItem>
    </>
  );
}
