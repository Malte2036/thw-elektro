import { useState } from "react";
import { Position, getRandomPosition } from "../lib/Position";
import { Consumer } from "../lib/data/Consumer";
import { Distributor } from "../lib/data/Distributor";
import { Producer } from "../lib/data/Producer";
import { ConsumerData, DistributorData, ProducerData } from "./page";

export default function FlowMenu({
  addConsumerNodeCallback,
  addDistributorNodeCallback,
  addProducerNodeCallback,
  closeMenu,
}: {
  addConsumerNodeCallback: (consumerData: ConsumerData) => void;
  addDistributorNodeCallback: (distributorData: DistributorData) => void;
  addProducerNodeCallback: (producerData: ProducerData) => void;
  closeMenu: () => void;
}) {
  const [consumerEnergyConsumption, setConsumerEnergyConsumption] =
    useState<number>(5.2);
  const [consumerName, setConsumerName] = useState<string>("");
  const [distributorName, setDistributorName] = useState<string>("");
  const [producerName, setProducerName] = useState<string>("");

  function generateId(prefix: string) {
    return `${prefix}-${Date.now().toString()}`;
  }

  const initialPosition: Position = { x: 100, y: 100 };

  function clickAddConsumerNode() {
    const consumerNode: ConsumerData = {
      consumer: new Consumer(
        generateId("consumer"),
        consumerName.length > 0 ? consumerName : undefined,
        consumerEnergyConsumption * 1000
      ),
      position: initialPosition,
    };
    addConsumerNodeCallback(consumerNode);
    closeMenu();
  }

  function clickAddDistributorNode() {
    const distributorNode: DistributorData = {
      distributor: new Distributor(
        generateId("distributor"),
        distributorName.length > 0 ? distributorName : undefined
      ),
      position: initialPosition,
    };
    addDistributorNodeCallback(distributorNode);
    closeMenu();
  }

  function clickAddProducerNode() {
    const producerNode: ProducerData = {
      producer: new Producer(
        generateId("producer"),
        producerName.length > 0 ? producerName : undefined
      ),
      position: initialPosition,
    };
    addProducerNodeCallback(producerNode);
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
          <button
            className="bg-thw text-white px-2 rounded-md"
            onClick={clickAddProducerNode}
          >
            Hinzufügen
          </button>
        </div>
        <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
          <div className="text-xl font-bold">Verteiler</div>
          <label>Name:</label>
          <input
            className="bg-thw text-white px-2 rounded-md"
            value={distributorName}
            onChange={(e) => setDistributorName(e.target.value)}
          />
          <button
            className="bg-thw text-white px-2 rounded-md"
            onClick={clickAddDistributorNode}
          >
            Hinzufügen
          </button>
        </div>
        <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
          <button className="text-xl font-bold">Verbraucher</button>{" "}
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
            onChange={(e) =>
              setConsumerEnergyConsumption(parseFloat(e.target.value))
            }
          />
          <button
            className="bg-thw text-white px-2 rounded-md"
            onClick={clickAddConsumerNode}
          >
            Hinzufügen
          </button>
        </div>
      </div>
      <button onClick={closeMenu}>Schliessen</button>
    </div>
  );
}
