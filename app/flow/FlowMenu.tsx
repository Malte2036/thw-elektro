import { useState } from "react";
import { Position, getRandomPosition } from "../lib/Position";
import { Consumer } from "../lib/data/Consumer";
import { Distributor } from "../lib/data/Distributor";
import { Producer } from "../lib/data/Producer";
import { ElectroInterface, ElectroType } from "../lib/data/Electro";
import { Button } from "@/components/Button";

export default function FlowMenu({
  addElectroInterfaceNodeCallback,
  closeMenu,
}: {
  addElectroInterfaceNodeCallback: (electroInterface: ElectroInterface) => void;
  closeMenu: () => void;
}) {
  const [consumerEnergyConsumption, setConsumerEnergyConsumption] =
    useState<string>("5.2");
  const [consumerName, setConsumerName] = useState<string>("");
  const [distributorName, setDistributorName] = useState<string>("");
  const [producerName, setProducerName] = useState<string>("");

  function generateId(prefix: string) {
    return `${prefix}-${Date.now().toString()}`;
  }

  const initialPosition: Position = { x: 100, y: 100 };

  function generateElectroInterface(type: ElectroType): ElectroInterface {
    switch (type) {
      case "Consumer":
        return new Consumer(
          generateId("consumer"),
          consumerName.length > 0 ? consumerName : undefined,
          initialPosition,
          parseFloat(consumerEnergyConsumption) * 1000
        );
      case "Distributor":
        return new Distributor(
          generateId("distributor"),
          distributorName.length > 0 ? distributorName : undefined,
          initialPosition
        );
      case "Producer":
        return new Producer(
          generateId("producer"),
          producerName.length > 0 ? producerName : undefined,
          initialPosition
        );
    }
  }

  function clickAddNode(type: ElectroType) {
    const electroInterface = generateElectroInterface(type);

    addElectroInterfaceNodeCallback(electroInterface);
    closeMenu();
  }

  return (
    <div className="w-full h-full bg-thw text-white p-4 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
          <div className="text-xl font-bold">Erzeuger</div>
          <label>Name:</label>
          <input
            className="bg-thw text-white px-2 rounded-md"
            value={producerName}
            onChange={(e) => setProducerName(e.target.value)}
          />
          <Button type="primary" onClick={() => clickAddNode("Producer")}>
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
          <Button type="primary" onClick={() => clickAddNode("Distributor")}>
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
            onChange={(e) => setConsumerEnergyConsumption(e.target.value)}
          />
          <Button type="primary" onClick={() => clickAddNode("Consumer")}>
            Hinzufügen
          </Button>
        </div>
      </div>
      <button onClick={closeMenu}>Schliessen</button>
    </div>
  );
}
