import { Handle, Position } from "reactflow";
import { Consumer } from "../lib/data/Consumer";

export function ConsumerNode({
  data,
}: {
  data: { consumer: Consumer; hasEnergy: boolean };
}) {
  return (
    <div>
      <div
        className={`${
          data.hasEnergy ? "bg-thw" : "bg-thw-400"
        } text-white px-6 py-2`}
      >
        <div className="text-xs">Verbraucher:</div>
        {data.consumer.energyConsumption / 1000}kW
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
