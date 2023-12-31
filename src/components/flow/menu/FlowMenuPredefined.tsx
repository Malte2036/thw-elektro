import Button from "../../../components/Button";
import { ElectroType, translateElectroType } from "../../../lib/data/Electro";
import { useEffect, useState } from "react";
import { Predefined, getBodyFromPredefined } from "../../../lib/data/Predefined";
import { getPredefined } from "../../../lib/db/save";
import { FlowMenuHeaderOptions } from "./FlowMenuHeader";
import FlowMenuItem from "./FlowMenuItem";
import { Plug } from "../../../lib/data/Plug";
import { useDialogContext } from "../../../hooks/useDialog";
import ConfirmDialog from "../../ConfirmDialog";

type FlowMenuPredefinedProps = {
  allPlacedNodeTemplateIds: string[];
  addNode: (
    type: ElectroType,
    name: string,
    consumerEnergyConsumption: number | undefined,
    producerEnergyProduction: number | undefined,
    ratedPower: number | undefined,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ) => void;
  deleteNode: (id: string) => void;
  openAddPredefinedPage: () => void;
};

export default function FlowMenuPredefined({
  allPlacedNodeTemplateIds,
  addNode,
  deleteNode,
  openAddPredefinedPage,
}: FlowMenuPredefinedProps) {
  const dialogContext = useDialogContext();

  const [allPredefinedNodes, setAllPredefinedNodes] = useState<
    Predefined[] | undefined
  >(undefined);

  const sortedNodes: Predefined[] | undefined = allPredefinedNodes
    ?.slice()
    .sort((a, b) => {
      const aIsAlreadyPlaced = allPlacedNodeTemplateIds.includes(a.id);
      const bIsAlreadyPlaced = allPlacedNodeTemplateIds.includes(b.id);

      if (aIsAlreadyPlaced && !bIsAlreadyPlaced) {
        return 1; // 'b' comes before 'a'
      } else if (!aIsAlreadyPlaced && bIsAlreadyPlaced) {
        return -1; // 'a' comes before 'b'
      }

      // Compare types first
      const typeComparison = a.type.localeCompare(b.type);

      if (typeComparison !== 0) {
        // If types are different, sort by type
        return typeComparison;
      } else {
        // If types are the same, handle the possibility of undefined names
        const nameA = a.name || ""; // Use an empty string if name is undefined
        const nameB = b.name || ""; // Use an empty string if name is undefined
        return nameA.localeCompare(nameB);
      }
    });


  async function fetchPredefined() {
    const data = await getPredefined();
    setAllPredefinedNodes(data);
  }

  useEffect(() => {
    fetchPredefined();
  }, []);

  if (sortedNodes === undefined) return <></>;

  if (sortedNodes.length === 0) {
    return (
      <FlowMenuItem>
        <span>
          Keine vordefinierten <b>Templates</b> vorhanden. Erstelle erst welche.
        </span>
        <Button onClick={openAddPredefinedPage} type="primary">
          Gehe zu &quot;{FlowMenuHeaderOptions.Create}&quot;
        </Button>
      </FlowMenuItem>
    );
  }

  function addNodeFromPredefined(node: Predefined) {
    const energyConsumption =
      node.type === "Consumer" ? node.energyConsumption : undefined;
    const energyProduction =
      node.type === "Producer" ? node.energyProduction : undefined;

    addNode(
      node.type,
      node.name || "",
      energyConsumption,
      energyProduction,
      node.ratedPower,
      node.id,
      node.defaultPlug
    );
  }

  return sortedNodes.map((node) => (
    <FlowMenuItem
      className={
        allPlacedNodeTemplateIds.includes(node.id) ? "opacity-50" : undefined
      }
      key={node.id}
    >
      <div className="text-xl font-bold">
        {`${translateElectroType(node.type)}${node.name != undefined && node.name.length > 0 ? ": " + node.name : ""
          }`}
      </div>
      {getBodyFromPredefined(node)}
      <div className="flex flex-row gap-2">
        <Button
          type="primary"
          onClick={() => {
            if (allPlacedNodeTemplateIds.includes(node.id)) {
              dialogContext?.setDialog(
                <ConfirmDialog title="Duplikat" question="Dieses Template wurde bereits platziert. Es wird eine Kopie des Templates platziert." onConfirm={() => addNodeFromPredefined(node)} />
              );
              return;
            }
            addNodeFromPredefined(node);
          }}
        >
          Hinzufügen
        </Button>
        <Button
          onClick={() =>
            dialogContext?.setDialog(
              <ConfirmDialog title="Template löschen" question="Willst du wirklich dieses Template unwiderruflich löschen?" onConfirm={() => {
                deleteNode(node.id);
                fetchPredefined();
              }} />
            )}
          type="secondary"
        >
          Löschen
        </Button>
      </div>
    </FlowMenuItem >
  ));
}
