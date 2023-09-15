import Button from "../../../components/Button";
import FlowMenuItem from "./FlowMenuItem";
import {
  exportDataAsJson,
  importJsonData,
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
  closeMenu: () => void;
};

export default function FlowMenuSettings({
  openPredefinedPage,
}: FlowMenuSettingsProps) {
  const [templateFile, setTemplateFile] = useState<File>();
  const [flowFile, setFlowFile] = useState<File>();


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
      type ImportedFlowData = {
        nodes: ReactFlow.Node[],
        edges: ReactFlow.Edge[]
      }
      const data = await importJsonData<ImportedFlowData>(flowFile);
      if (data) {
        flow.setNodes(data.nodes);
        flow.setEdges(data.edges);
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
      </FlowMenuItem> <FlowMenuItem>
        <div>
          Hiermit kann ein Flow eines anderen Nutzers importiert werden.
        </div>
        <input type="file" accept=".json" onChange={handleFlowFileChange} />
        <Button
          onClick={startFlowImport}
          type="secondary"
          disabled={flowFile == undefined}
        >
          Importieren
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
        <input type="file" accept=".json" onChange={handleTemplateFileChange} />
        <Button
          onClick={startTemplateImport}
          type="secondary"
          disabled={templateFile == undefined}
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
