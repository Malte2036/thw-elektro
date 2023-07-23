import { Button } from "@/components/Button";
import { useState } from "react";
import { ElectroType } from "../lib/data/Electro";
import { Predefined } from "../lib/data/Predefined";
import { generateId } from "../lib/utils";
import FlowMenuItem from "./FlowMenuItem";
import { Plug } from "../lib/data/Plug";
import FlowMenuCreateForm from "./FlowMenuCreateForm";

type FlowMenuCreateProps = {
  addNodeCallback: (
    type: ElectroType,
    name: string,
    consumerEnergyConsumption: number | undefined,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ) => void;
  saveNodeCallback: (predefined: Predefined) => void;
};

export default function FlowMenuCreate({
  addNodeCallback,
  saveNodeCallback,
}: FlowMenuCreateProps) {
  const [consumerEnergyConsumption, setConsumerEnergyConsumption] =
    useState<string>("5.2");
  const [consumerName, setConsumerName] = useState<string>("");
  const [distributorName, setDistributorName] = useState<string>("");
  const [producerName, setProducerName] = useState<string>("");

  function getParsedEnergyConsumption(): number {
    const parsedEnergyConsumption = parseFloat(consumerEnergyConsumption);
    if (isNaN(parsedEnergyConsumption)) {
      throw new Error("Invalid energy consumption");
    }
    return parsedEnergyConsumption;
  }

  return (
    <>
      <FlowMenuCreateForm
        electroType="Producer"
        addNode={addNodeCallback}
        saveNodeAsPredefined={saveNodeCallback}
      />
      <FlowMenuCreateForm
        electroType="Distributor"
        addNode={addNodeCallback}
        saveNodeAsPredefined={saveNodeCallback}
      />
      <FlowMenuCreateForm
        electroType="Consumer"
        addNode={addNodeCallback}
        saveNodeAsPredefined={saveNodeCallback}
      />
    </>
  );
}
