import { Button } from "@/components/Button";
import { ElectroType, translateElectroType } from "../lib/data/Electro";
import { Consumer } from "../lib/data/Consumer";
import { ReactNode, useEffect, useState } from "react";
import { Predefined } from "../lib/data/Predefined";
import { getPredefined, savePredefined } from "../lib/db/save";

type FlowMenuPredefinedProps = {
  addNodeCallback: (
    type: ElectroType,
    name: string,
    consumerEnergyConsumption?: number
  ) => void;
};

export default function FlowMenuPredefined({
  addNodeCallback,
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

  useEffect(() => {
    async function fetchPredefined() {
      const data = await getPredefined();
      setAllPredefinedNodes(data);
    }
    fetchPredefined();
  }, []);

  return sortedNodes.map((node) => (
    <div
      key={node.id}
      className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start"
    >
      <div className="text-xl font-bold">
        {`${translateElectroType(node.type)}${
          node.name != undefined ? ": " + node.name : ""
        }`}
      </div>
      {node.type === "Consumer" && getConsumerData(node as Consumer)}
      <Button
        type="primary"
        onClick={() => {
          const energyConsumption =
            node.type === "Consumer"
              ? (node as Consumer).energyConsumption
              : undefined;
          addNodeCallback(node.type, node.name || "", energyConsumption);
        }}
      >
        Hinzufügen
      </Button>
    </div>
  ));
}
