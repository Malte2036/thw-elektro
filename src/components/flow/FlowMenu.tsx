import { ReactNode, useState } from "react";
import { Position } from "../../lib/Position";
import { Consumer } from "../../lib/data/Consumer";
import { Distributor } from "../../lib/data/Distributor";
import { Producer } from "../../lib/data/Producer";
import { ElectroInterface, ElectroType } from "../../lib/data/Electro";
import FlowMenuHeader, { FlowMenuHeaderOptions } from "./FlowMenuHeader";
import FlowMenuCreate from "./FlowMenuCreate";
import FlowMenuPredefined from "./FlowMenuPredefined";
import { Predefined } from "../../lib/data/Predefined";
import { deletePredefined, savePredefined } from "../../lib/db/save";
import { generateId } from "../../lib/utils";
import { Button } from "../../components/Button";
import FlowMenuSettings from "./FlowMenuSettings";
import { Plug } from "../../lib/data/Plug";

type FlowMenuProps = {
  allPlacedNodeTemplateIds: string[];
  addElectroInterfaceNodeCallback: (electroInterface: ElectroInterface) => void;
  closeMenu: () => void;
};

export default function FlowMenu({
  allPlacedNodeTemplateIds,
  addElectroInterfaceNodeCallback,
  closeMenu,
}: FlowMenuProps) {
  function generateElectroInterface(
    type: ElectroType,
    name: string | undefined,
    consumerEnergyConsumption: number | undefined,
    producerEnergyProduction: number | undefined,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ): ElectroInterface {
    const initialPosition: Position = {
      x: 100 + Math.random() * 50,
      y: 100 + Math.random() * 50,
    };

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
          consumerEnergyConsumption,
          templateId,
          inputPlug
        );
      case "Distributor":
        return new Distributor(
          generateId("distributor"),
          name,
          initialPosition,
          templateId,
          inputPlug
        );
      case "Producer":
        if (!producerEnergyProduction)
          throw new Error(
            "Producer energy production is undefined" + producerEnergyProduction
          );

        return new Producer(
          generateId("producer"),
          name,
          initialPosition,
          templateId,
          producerEnergyProduction
        );
    }
  }

  const [selectedOption, setSelectedOption] = useState<FlowMenuHeaderOptions>(
    FlowMenuHeaderOptions.Predefined
  );

  async function clickAddNode(
    type: ElectroType,
    name: string,
    consumerEnergyConsumption: number | undefined,
    producerEnergyProduction: number | undefined,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ) {
    const electroInterface = generateElectroInterface(
      type,
      name.length > 0 ? name : undefined,
      consumerEnergyConsumption,
      producerEnergyProduction,
      templateId,
      inputPlug
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
            allPlacedNodeTemplateIds={allPlacedNodeTemplateIds}
            addNode={clickAddNode}
            deleteNode={(id: string) => deletePredefined(id)}
            openAddPredefinedPage={() =>
              setSelectedOption(FlowMenuHeaderOptions.Create)
            }
          />
        );
      case FlowMenuHeaderOptions.Settings:
        return (
          <FlowMenuSettings
            openPredefinedPage={() =>
              setSelectedOption(FlowMenuHeaderOptions.Predefined)
            }
          />
        );
      default:
        return <div>Not implemented</div>;
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
