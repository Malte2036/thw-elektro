import { Button } from "@/components/Button";
import { ElectroType, translateElectroType } from "../lib/data/Electro";
import { Consumer } from "../lib/data/Consumer";
import { ReactNode, useEffect, useState } from "react";
import { Predefined } from "../lib/data/Predefined";
import { getPredefined } from "../lib/db/save";
import { FlowMenuHeaderOptions } from "./FlowMenuHeader";

type FlowMenuPredefinedProps = {
  addNode: (
    type: ElectroType,
    name: string,
    consumerEnergyConsumption?: number
  ) => void;
  deleteNode: (id: string) => void;
  openAddPredefinedPage: () => void;
};

export default function FlowMenuPredefined({
  addNode,
  deleteNode,
  openAddPredefinedPage,
}: FlowMenuPredefinedProps) {
  const [allPredefinedNodes, setAllPredefinedNodes] = useState<Predefined[]>(
    []
  );

  const sortedNodes = allPredefinedNodes.slice().sort((a, b) => {
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

  function getConsumerData(consumer: Consumer): ReactNode {
    return <div>Energiebedarf in kW: {consumer.energyConsumption / 1000}</div>;
  }

  async function fetchPredefined() {
    const data = await getPredefined();
    setAllPredefinedNodes(data);
  }

  useEffect(() => {
    fetchPredefined();
  }, []);

  if (sortedNodes.length === 0) {
    return (
      <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
        <span>
          Keine vordefinierten <b>Templates</b> vorhanden. Erstelle erst welche.
        </span>
        <Button onClick={openAddPredefinedPage} type="primary">
          Gehe zur &quot;{FlowMenuHeaderOptions.Create}&quot;
        </Button>
      </div>
    );
  }

  return sortedNodes.map((node) => (
    <div
      key={node.id}
      className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start"
    >
      <div className="text-xl font-bold">
        {`${translateElectroType(node.type)}${
          node.name != undefined && node.name.length > 0 ? ": " + node.name : ""
        }`}
      </div>
      {node.type === "Consumer" && getConsumerData(node as Consumer)}
      <div className="flex flex-row gap-2">
        <Button
          type="primary"
          onClick={() => {
            const energyConsumption =
              node.type === "Consumer"
                ? (node as Consumer).energyConsumption
                : undefined;
            addNode(node.type, node.name || "", energyConsumption);
          }}
        >
          Hinzufügen
        </Button>
        <Button
          onClick={() => {
            deleteNode(node.id);
            fetchPredefined();
          }}
          type="secondary"
        >
          Löschen
        </Button>
      </div>
    </div>
  ));
}
