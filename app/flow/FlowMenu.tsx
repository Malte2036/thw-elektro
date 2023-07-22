import { ReactNode, useState } from "react";
import { Position } from "../lib/Position";
import { Consumer } from "../lib/data/Consumer";
import { Distributor } from "../lib/data/Distributor";
import { Producer } from "../lib/data/Producer";
import { ElectroInterface, ElectroType } from "../lib/data/Electro";
import FlowMenuHeader, { FlowMenuHeaderOptions } from "./FlowMenuHeader";
import FlowMenuCreate from "./FlowMenuCreate";
import FlowMenuPredefined from "./FlowMenuPredefined";
import { Predefined } from "../lib/data/Predefined";
import { deletePredefined, savePredefined } from "../lib/db/save";
import { generateId } from "../lib/utils";
import { Button } from "@/components/Button";

export default function FlowMenu({
  addElectroInterfaceNodeCallback,
  closeMenu,
}: {
  addElectroInterfaceNodeCallback: (electroInterface: ElectroInterface) => void;
  closeMenu: () => void;
}) {
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

  const [selectedOption, setSelectedOption] = useState<FlowMenuHeaderOptions>(
    FlowMenuHeaderOptions.Create
  );

  async function clickAddNode(
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
  async function saveNodeAsPredefined(predefined: Predefined) {
    await savePredefined(predefined);
    setSelectedOption(FlowMenuHeaderOptions.Predefined);
  }

  function getFlowMenuPart(): ReactNode {
    switch (selectedOption) {
      case FlowMenuHeaderOptions.Create:
        return (
          <FlowMenuCreate
            addNodeCallback={clickAddNode}
            saveNodeCallback={saveNodeAsPredefined}
          />
        );
      case FlowMenuHeaderOptions.Predefined:
        return (
          <FlowMenuPredefined
            addNode={clickAddNode}
            deleteNode={(id: string) => deletePredefined(id)}
          />
        );
    }
  }

  return (
    <div className="w-full h-full bg-thw text-white flex flex-col justify-between overflow-y-auto p-4">
      <div className="flex flex-col gap-4">
        <FlowMenuHeader
          selectedOption={selectedOption}
          selectOptionCallback={setSelectedOption}
        />
        {getFlowMenuPart()}
      </div>
      <div className="mt-4 flex flex-row justify-center">
        <Button onClick={closeMenu} type="primary">
          Schliessen
        </Button>
      </div>
    </div>
  );
}
