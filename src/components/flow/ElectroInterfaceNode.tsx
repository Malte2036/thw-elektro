import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { ElectroInterface, getTitleForElectro } from "../../lib/data/Electro";
import { ReactNode } from "react";
import { Consumer } from "../../lib/data/Consumer";
import { isVoltageDropTooHigh } from "../../lib/calculation/energy";
import { Distributor } from "../../lib/data/Distributor";
import Button from "../../components/Button";
import { Producer } from "../../lib/data/Producer";
import { formatNumberWithMaxTwoDecimals } from "../../lib/utils";
import { useDialogContext } from "../../hooks/useDialog";
import NodeInfoDialog from "../NodeInfoDialog";

export type ElectroInterfaceNodeProps = {
  electroInterface: ElectroInterface;
  deleteNode: () => void;
  childrenElectroInterfaces: ElectroInterface[];
};

export function ElectroInterfaceNode({
  data,
  selected
}: NodeProps<ElectroInterfaceNodeProps>) {

  function getMainLine(): ReactNode {
    switch (data.electroInterface.type) {
      case "Consumer":
        const consumer = data.electroInterface as Consumer;
        const totalVoltageDrop = consumer.totalVoltageDrop ?? 0;
        return (
          <>
            <div>
              {formatNumberWithMaxTwoDecimals(
                consumer.energyConsumption / 1000
              )}
              kW
            </div>
            <div
              className={
                isVoltageDropTooHigh(totalVoltageDrop)
                  ? "text-red-600 font-bold"
                  : ""
              }
            >
              {formatNumberWithMaxTwoDecimals(totalVoltageDrop)}%
            </div>
            <div>Nennstrom: {formatNumberWithMaxTwoDecimals(consumer.ratedPower ?? 0)}A</div>
            <div>Scheinleistung: {formatNumberWithMaxTwoDecimals(consumer.getApparentPower() / 1000)}kVA</div>
            <div>Wirkleistung: {formatNumberWithMaxTwoDecimals(consumer.getActivePower() / 1000)}kW</div>
            <div>Blindleistung: {formatNumberWithMaxTwoDecimals(consumer.getReactivePower() / 1000)}kVA</div>
          </>
        );
      case "Distributor":
        const distributor = data.electroInterface as Distributor;
        return (
          <>
            <div>
              {formatNumberWithMaxTwoDecimals(distributor.energyFlow / 1000)}kW
            </div>
            <div
              className={`text-xs ${distributor.energyFlow > distributor.allowedEnergyFlow
                ? "text-red-600 font-bold"
                : "opacity-75"
                }`}
            >
              max Leistung:{" "}
              {formatNumberWithMaxTwoDecimals(
                distributor.allowedEnergyFlow / 1000
              )}
              kW
            </div>
            <div>Scheinleistung: {formatNumberWithMaxTwoDecimals(distributor.getApparentPower(data.childrenElectroInterfaces) / 1000)}kVA</div>
          </>
        );
      case "Producer":
        const producer = data.electroInterface as Producer;
        return (
          <>
            <div>
              {formatNumberWithMaxTwoDecimals(producer.energyFlow / 1000)}kW
            </div>
            <div
              className={`text-xs ${producer.energyFlow > producer.allowedEnergyFlow
                ? "text-red-600 font-bold"
                : "opacity-75"
                }`}
            >
              max Leistung:{" "}
              {formatNumberWithMaxTwoDecimals(
                producer.allowedEnergyFlow / 1000
              )}
              kW
            </div>
            <div className="text-xs opacity-75">
              Produktion:{" "}
              {formatNumberWithMaxTwoDecimals(producer.energyProduction / 1000)}
              kVA
            </div>
          </>
        );
    }
  }

  function getHandles(): ReactNode {
    switch (data.electroInterface.type) {
      case "Consumer":
        return (
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            style={{ width: 12, height: 12 }}
          />
        );
      case "Distributor":
        return (
          <>
            <Handle
              type="target"
              position={Position.Left}
              id="input"
              style={{ width: 12, height: 12 }}
            />{" "}
            <Handle
              type="source"
              position={Position.Right}
              id="target"
              style={{ width: 12, height: 12 }}
            />
          </>
        );
      case "Producer":
        return (
          <Handle
            type="source"
            position={Position.Right}
            id="output"
            style={{ width: 12, height: 12 }}
          />
        );
    }
  }

  const dialogContext = useDialogContext();

  function openNodeInfoDialog() {
    dialogContext?.setDialog(<NodeInfoDialog electroInterface={data.electroInterface}></NodeInfoDialog>)
  }

  function getNodeToolbar(): ReactNode {
    const buttons = [
      <Button key={"info"} type="secondary" onClick={openNodeInfoDialog}>
        Info
      </Button>,
      <Button key={"delete"} type="secondary" onClick={data.deleteNode}>
        Delete
      </Button>,
    ];

    return (
      <NodeToolbar isVisible={selected} className="flex flex-row gap-2">
        {...buttons}
      </NodeToolbar>
    );
  }

  function hasEnergy(): boolean {
    switch (data.electroInterface.type) {
      case "Consumer":
        const consumer = data.electroInterface as Consumer;
        return consumer.hasEnergy;
      case "Distributor":
        const distributor = data.electroInterface as Distributor;
        return distributor.hasEnergy;
      case "Producer":
        return true;
    }
  }

  return (
    <div>
      {getNodeToolbar()}
      <div
        className={`${hasEnergy() ? "bg-thw" : "bg-thw-400"
          } transition-colors text-white px-6 py-2 rounded-sm`}
      >
        <div className="text-xs">{getTitleForElectro(data.electroInterface)}</div>
        {getMainLine()}
      </div>
      {getHandles()}
    </div>
  );
}
