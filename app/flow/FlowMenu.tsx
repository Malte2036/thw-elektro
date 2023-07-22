import { ReactNode, useState } from "react";
import { Position, getRandomPosition } from "../lib/Position";
import { Consumer } from "../lib/data/Consumer";
import { Distributor } from "../lib/data/Distributor";
import { Producer } from "../lib/data/Producer";
import { ElectroInterface, ElectroType } from "../lib/data/Electro";
import { Button } from "@/components/Button";
import FlowMenuHeader, { FlowMenuHeaderOptions } from "./FlowMenuHeader";
import FlowMenuCreate from "./FlowMenuCreate";
import FlowMenuPredefined from "./FlowMenuPredefined";

export default function FlowMenu({
  addElectroInterfaceNodeCallback,
  closeMenu,
}: {
  addElectroInterfaceNodeCallback: (electroInterface: ElectroInterface) => void;
  closeMenu: () => void;
}) {
  function generateId(prefix: string) {
    return `${prefix}-${Date.now().toString()}-${(Math.random() * 1000).toFixed(
      0
    )}-}`;
  }

  const initialPosition: Position = { x: 100, y: 100 };

  function generateElectroInterface(
    type: ElectroType,
    name: string | undefined,
    consumerEnergyConsumption?: number
  ): ElectroInterface {
    switch (type) {
      case "Consumer":
        if (!consumerEnergyConsumption)
          throw new Error(
            "Consumer energy consumption is undefined" +
              consumerEnergyConsumption
          );

        return new Consumer(
          generateId("consumer"),
          name,
          initialPosition,
          consumerEnergyConsumption
        );
      case "Distributor":
        return new Distributor(
          generateId("distributor"),
          name,
          initialPosition
        );
      case "Producer":
        return new Producer(generateId("producer"), name, initialPosition);
    }
  }

  function clickAddNode(
    type: ElectroType,
    name: string,
    consumerEnergyConsumption?: number
  ) {
    const electroInterface = generateElectroInterface(
      type,
      name.length > 0 ? name : undefined,
      consumerEnergyConsumption
    );

    addElectroInterfaceNodeCallback(electroInterface);
    closeMenu();
  }

  const [selectedOption, setSelectedOption] = useState<FlowMenuHeaderOptions>(
    FlowMenuHeaderOptions.Create
  );

  const allPredefinedNodes = [
    new Consumer(generateId("consumer"), "Chiemsee", { x: 0, y: 0 }, 3200),
    new Producer(generateId("producer"), "SEA", { x: 0, y: 0 }),
  ];

  function getFlowMenuPart(): ReactNode {
    switch (selectedOption) {
      case FlowMenuHeaderOptions.Create:
        return <FlowMenuCreate addNodeCallback={clickAddNode} />;
      case FlowMenuHeaderOptions.Predefined:
        return (
          <FlowMenuPredefined
            allPredefinedNodes={allPredefinedNodes}
            addNodeCallback={clickAddNode}
          />
        );
    }
  }

  return (
    <div className="w-full h-full bg-thw text-white p-4 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <FlowMenuHeader
          selectedOption={selectedOption}
          selectOptionCallback={setSelectedOption}
        />
        {getFlowMenuPart()}
      </div>
      <button onClick={closeMenu}>Schliessen</button>
    </div>
  );
}
