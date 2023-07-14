import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { ElectroInterface, translateElectroType } from "../lib/data/Electro";
import { ReactNode } from "react";
import { Consumer } from "../lib/data/Consumer";
import { isVoltageDropTooHigh } from "../lib/calculation/energy";
import { Distributor } from "../lib/data/Distributor";
import { Button } from "@/components/Button";

type ElectroInterfaceNodeProps = {
  electroInterface: ElectroInterface;
  deleteNode: () => void;
};

export function ElectroInterfaceNode({
  data,
  selected,
}: NodeProps<ElectroInterfaceNodeProps>) {
  function getTitle(): string {
    const translatedType = translateElectroType(data.electroInterface.type);
    const name = data.electroInterface.name;
    return `${translatedType}${name != undefined ? ` (${name})` : ""}:`;
  }

  function getMainLine(): ReactNode {
    switch (data.electroInterface.type) {
      case "Consumer":
        const consumer = data.electroInterface as Consumer;
        const totalVoltageDrop = consumer.totalVoltageDrop ?? 0;
        return (
          <>
            {consumer.energyConsumption / 1000}kW
            <div
              className={
                isVoltageDropTooHigh(totalVoltageDrop)
                  ? "text-red-600 font-bold"
                  : ""
              }
            >
              {totalVoltageDrop.toFixed(2)}%
            </div>
          </>
        );
      case "Distributor":
        const distributor = data.electroInterface as Distributor;
        return <>{distributor.energyFlow / 1000}kW</>;
      case "Producer":
        const producer = data.electroInterface as Distributor;
        return <>{producer.energyFlow / 1000}kW</>;
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

  function getNodeToolbar(): ReactNode {
    const buttons = [
      <Button type="secondary" onClick={data.deleteNode}>
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
        className={`${
          hasEnergy() ? "bg-thw" : "bg-thw-400"
        } transition-colors text-white px-6 py-2 rounded-sm`}
      >
        <div className="text-xs">{getTitle()}</div>
        {getMainLine()}
      </div>
      {getHandles()}
    </div>
  );
}
