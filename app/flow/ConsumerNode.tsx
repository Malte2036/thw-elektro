import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { Consumer } from "../lib/data/Consumer";
import { isVoltageDropTooHigh } from "../lib/calculation/energy";

type ConsumerNodeProps = {
  consumer: Consumer;
  hasEnergy: boolean;
  totalVoltageDrop: number;
  deleteNode: () => void;
};

export function ConsumerNode({ data, selected }: NodeProps<ConsumerNodeProps>) {
  return (
    <div>
      <NodeToolbar isVisible={selected}>
        <button
          className="border-2 rounded-md border-thw bg-white p-1"
          onClick={data.deleteNode}
        >
          Delete
        </button>
      </NodeToolbar>
      <div
        className={`${
          data.hasEnergy ? "bg-thw" : "bg-thw-400"
        } transition-colors text-white px-6 py-2 rounded-sm`}
      >
        <div className="text-xs">
          Verbraucher
          {data?.consumer.name != undefined ? ` (${data.consumer.name})` : ""}:
        </div>
        {data.consumer.energyConsumption / 1000}kW
        <div
          className={
            isVoltageDropTooHigh(data.totalVoltageDrop)
              ? "text-red-600 font-bold"
              : ""
          }
        >
          {data.totalVoltageDrop.toFixed(2)}%
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ width: 12, height: 12 }}
      />
    </div>
  );
}
