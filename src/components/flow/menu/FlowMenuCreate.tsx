import { ElectroType } from "../../../lib/data/Electro";
import { Predefined } from "../../../lib/data/Predefined";
import { Plug } from "../../../lib/data/Plug";
import FlowMenuCreateForm from "./FlowMenuCreateForm";

type FlowMenuCreateProps = {
  addNodeCallback: (
    type: ElectroType,
    name: string,
    consumerEnergyConsumption: number | undefined,
    producerEnergyProduction: number | undefined,
    ratedPower: number | undefined,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ) => void;
  saveNodeCallback: (predefined: Predefined) => void;
};

export default function FlowMenuCreate({
  addNodeCallback,
  saveNodeCallback,
}: FlowMenuCreateProps) {
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
