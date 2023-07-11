import { Handle, Position } from "reactflow";
import { Consumer } from "../lib/data/Consumer";
import { isVoltageDropTooHigh } from "../lib/calculation/energy";
import { getNodeNameById } from "../lib/utils";

export function ConsumerNode({
  data,
}: {
  data: { consumer: Consumer; hasEnergy: boolean; totalVoltageDrop: number };
}) {
  const nodeName = getNodeNameById(data.consumer.id, "consumer");
  return (
    <div>
      <div
        className={`${
          data.hasEnergy ? "bg-thw" : "bg-thw-400"
        } transition-colors text-white px-6 py-2 rounded-sm`}
      >
        <div className="text-xs">
          Verbraucher{nodeName.length > 0 ? ` (${nodeName})` : ""}:
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
