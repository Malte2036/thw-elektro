import { Button } from "@/components/Button";
import { useState } from "react";
import { ElectroType } from "../lib/data/Electro";

type FlowMenuCreateProps = {
  addNodeCallback: (
    type: ElectroType,
    name: string,
    consumerEnergyConsumption?: number
  ) => void;
};

export default function FlowMenuCreate({
  addNodeCallback,
}: FlowMenuCreateProps) {
  const [consumerEnergyConsumption, setConsumerEnergyConsumption] =
    useState<string>("5.2");
  const [consumerName, setConsumerName] = useState<string>("");
  const [distributorName, setDistributorName] = useState<string>("");
  const [producerName, setProducerName] = useState<string>("");

  return (
    <>
      <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
        <div className="text-xl font-bold">Erzeuger</div>
        <label>Name:</label>
        <input
          className="bg-thw text-white px-2 rounded-md"
          value={producerName}
          onChange={(e) => setProducerName(e.target.value)}
        />
        <Button
          type="primary"
          onClick={() => addNodeCallback("Producer", producerName)}
        >
          Hinzufügen
        </Button>
      </div>
      <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
        <div className="text-xl font-bold">Verteiler</div>
        <label>Name:</label>
        <input
          className="bg-thw text-white px-2 rounded-md"
          value={distributorName}
          onChange={(e) => setDistributorName(e.target.value)}
        />
        <Button
          type="primary"
          onClick={() => addNodeCallback("Distributor", distributorName)}
        >
          Hinzufügen
        </Button>
      </div>
      <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
        <div className="text-xl font-bold">Verbraucher</div>
        <label>Name:</label>
        <input
          className="bg-thw text-white px-2 rounded-md"
          value={consumerName}
          onChange={(e) => setConsumerName(e.target.value)}
        />
        <label>Energiebedarf in kW:</label>
        <input
          className="bg-thw text-white px-2 rounded-md"
          value={consumerEnergyConsumption}
          type="number"
          min={0}
          onChange={(e) => {
            const value = e.target.value;
            if (value.includes("-")) return;

            setConsumerEnergyConsumption(value);
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            const parsedEnergyConsumption = parseFloat(
              consumerEnergyConsumption
            );
            if (isNaN(parsedEnergyConsumption)) {
              throw new Error("Invalid energy consumption");
            }

            addNodeCallback(
              "Consumer",
              consumerName,
              parsedEnergyConsumption * 1000
            );
          }}
        >
          Hinzufügen
        </Button>
      </div>
    </>
  );
}
