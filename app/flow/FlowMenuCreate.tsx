import { Button } from "@/components/Button";
import { useState } from "react";
import { ElectroType } from "../lib/data/Electro";
import { Predefined } from "../lib/data/Predefined";
import { generateId } from "../lib/utils";
import FlowMenuItem from "./FlowMenuItem";
import { Plug } from "../lib/data/Plug";

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
      <FlowMenuItem>
        <div className="text-xl font-bold">Erzeuger</div>
        <label>Name:</label>
        <input
          className="bg-thw text-white px-2 rounded-md"
          value={producerName}
          onChange={(e) => setProducerName(e.target.value)}
        />{" "}
        <div className="flex flex-row gap-2">
          <Button
            type="primary"
            onClick={() =>
              addNodeCallback(
                "Producer",
                producerName,
                undefined,
                undefined,
                undefined
              )
            }
          >
            Hinzufügen
          </Button>
          <Button
            type="secondary"
            onClick={() =>
              saveNodeCallback({
                id: generateId("producer"),
                type: "Producer",
                name: producerName,
                defaultPlug: { current: 63, voltage: 400 },
              })
            }
          >
            Template speichern
          </Button>
        </div>
      </FlowMenuItem>
      <FlowMenuItem>
        <div className="text-xl font-bold">Verteiler</div>
        <label>Name:</label>
        <input
          className="bg-thw text-white px-2 rounded-md"
          value={distributorName}
          onChange={(e) => setDistributorName(e.target.value)}
        />{" "}
        <div className="flex flex-row gap-2">
          <Button
            type="primary"
            onClick={() =>
              addNodeCallback(
                "Distributor",
                distributorName,
                undefined,
                undefined,
                undefined
              )
            }
          >
            Hinzufügen
          </Button>
          <Button
            type="secondary"
            onClick={() =>
              saveNodeCallback({
                id: generateId("distributor"),
                type: "Distributor",
                name: distributorName,
                defaultPlug: { current: 63, voltage: 400 },
              })
            }
          >
            Template speichern
          </Button>
        </div>
      </FlowMenuItem>
      <FlowMenuItem>
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
        <div className="flex flex-row gap-2">
          <Button
            type="primary"
            onClick={() => {
              addNodeCallback(
                "Consumer",
                consumerName,
                getParsedEnergyConsumption() * 1000,
                undefined,
                undefined
              );
            }}
          >
            Hinzufügen
          </Button>
          <Button
            type="secondary"
            onClick={() => {
              saveNodeCallback({
                id: generateId("consumer"),
                type: "Consumer",
                name: consumerName,
                defaultPlug: { current: 63, voltage: 400 },
                energyConsumption: getParsedEnergyConsumption() * 1000,
              });
            }}
          >
            Template speichern
          </Button>
        </div>
      </FlowMenuItem>
    </>
  );
}
