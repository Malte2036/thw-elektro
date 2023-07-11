import { useState } from "react";
import { getRandomPosition } from "../lib/Position";
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

  function clickAddConsumerNode() {
    const consumerNode: ConsumerData = {
      consumer: new Consumer(
        "consumer-" + Math.random() * 1_000_000,
        consumerEnergyConsumption * 1000
      ),
      position: getRandomPosition(),
    };
    addConsumerNodeCallback(consumerNode);
    closeMenu();
  }

  function clickAddDistributorNode() {
    const distributorNode: DistributorData = {
      distributor: new Distributor("distributor-" + Math.random() * 1_000_000),
      position: getRandomPosition(),
    };
    addDistributorNodeCallback(distributorNode);
    closeMenu();
  }

  function clickAddProducerNode() {
    const producerNode: ProducerData = {
      producer: new Producer("producer-" + Math.random() * 1_000_000),
      position: getRandomPosition(),
    };
    addProducerNodeCallback(producerNode);
    closeMenu();
  }

  return (
    <div className="w-full h-full bg-thw text-white p-4 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
          <div className="text-xl font-bold">Erzeuger</div>
          <button
            className="bg-thw text-white px-2 rounded-md"
            onClick={clickAddProducerNode}
          >
            Hinzufügen
          </button>
        </div>{" "}
        <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
          <div className="text-xl font-bold">Verteiler</div>
          <button
            className="bg-thw text-white px-2 rounded-md"
            onClick={clickAddDistributorNode}
          >
            Hinzufügen
          </button>
        </div>
        <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
          <button className="text-xl font-bold">Verbraucher</button>
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
